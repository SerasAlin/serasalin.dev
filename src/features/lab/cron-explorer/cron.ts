import { z } from 'zod';

export const cronInputSchema = z.string().min(1).max(80);

type Field = {
  values: number[];
  min: number;
  max: number;
};

const parseRange = (part: string, min: number, max: number): number[] => {
  if (part === '*') {
    const out: number[] = [];
    for (let i = min; i <= max; i += 1) out.push(i);
    return out;
  }
  if (part.includes('/')) {
    const [rangePart, stepStr] = part.split('/');
    if (!stepStr) throw new Error(`Invalid step in "${part}"`);
    const step = Number.parseInt(stepStr, 10);
    if (!Number.isFinite(step) || step <= 0) throw new Error(`Invalid step: ${stepStr}`);
    const base = parseRange(rangePart!, min, max);
    return base.filter((_, idx) => idx % step === 0);
  }
  if (part.includes('-')) {
    const [a, b] = part.split('-').map((n) => Number.parseInt(n, 10));
    if (a === undefined || b === undefined || Number.isNaN(a) || Number.isNaN(b)) {
      throw new Error(`Invalid range: ${part}`);
    }
    if (a < min || b > max) throw new Error(`Range ${a}-${b} outside ${min}-${max}`);
    const out: number[] = [];
    for (let i = a; i <= b; i += 1) out.push(i);
    return out;
  }
  if (part.includes(',')) {
    return part.split(',').flatMap((p) => parseRange(p, min, max));
  }
  const single = Number.parseInt(part, 10);
  if (Number.isNaN(single) || single < min || single > max) {
    throw new Error(`Invalid value: ${part}`);
  }
  return [single];
};

const parseField = (part: string, min: number, max: number): Field => ({
  values: [...new Set(parseRange(part, min, max))].sort((a, b) => a - b),
  min,
  max,
});

export type CronSpec = {
  minutes: Field;
  hours: Field;
  daysOfMonth: Field;
  months: Field;
  daysOfWeek: Field;
};

export const parseCron = (expression: string): CronSpec => {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error('Expected exactly five fields: minute hour day-of-month month day-of-week.');
  }
  const [minute, hour, dom, month, dow] = parts as [string, string, string, string, string];
  return {
    minutes: parseField(minute, 0, 59),
    hours: parseField(hour, 0, 23),
    daysOfMonth: parseField(dom, 1, 31),
    months: parseField(month, 1, 12),
    daysOfWeek: parseField(dow.replace('7', '0'), 0, 6),
  };
};

export const nextExecutions = (spec: CronSpec, from: Date, count: number): Date[] => {
  const results: Date[] = [];
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const MAX_ITERATIONS = 60 * 24 * 366 * 2;
  let iterations = 0;
  while (results.length < count && iterations < MAX_ITERATIONS) {
    iterations += 1;
    if (
      spec.months.values.includes(cursor.getMonth() + 1) &&
      spec.daysOfMonth.values.includes(cursor.getDate()) &&
      spec.daysOfWeek.values.includes(cursor.getDay()) &&
      spec.hours.values.includes(cursor.getHours()) &&
      spec.minutes.values.includes(cursor.getMinutes())
    ) {
      results.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return results;
};
