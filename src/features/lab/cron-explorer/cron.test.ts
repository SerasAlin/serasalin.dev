import { describe, expect, it } from 'vitest';
import { parseCron, nextExecutions } from './cron';

describe('parseCron', () => {
  it('parses stars and ranges', () => {
    const spec = parseCron('*/15 9-17 * * 1-5');
    expect(spec.minutes.values).toEqual([0, 15, 30, 45]);
    expect(spec.hours.values).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
    expect(spec.daysOfWeek.values).toEqual([1, 2, 3, 4, 5]);
  });

  it('rejects wrong number of fields', () => {
    expect(() => parseCron('* * *')).toThrow();
  });

  it('rejects invalid values', () => {
    expect(() => parseCron('99 * * * *')).toThrow();
  });
});

describe('nextExecutions', () => {
  it('produces the next executions in order', () => {
    const spec = parseCron('0 9 * * 1-5');
    const from = new Date('2026-08-24T00:00:00Z'); // Monday
    const runs = nextExecutions(spec, from, 3);
    expect(runs).toHaveLength(3);
    for (let i = 1; i < runs.length; i += 1) {
      expect(runs[i]!.getTime()).toBeGreaterThan(runs[i - 1]!.getTime());
    }
  });
});
