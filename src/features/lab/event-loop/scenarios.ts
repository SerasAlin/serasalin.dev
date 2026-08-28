export type Frame = { id: string; label: string };

export type Step =
  | { kind: 'log'; value: string }
  | { kind: 'push'; frame: Frame }
  | { kind: 'pop'; frameId: string }
  | { kind: 'schedule-macrotask'; frame: Frame; note: string }
  | { kind: 'schedule-microtask'; frame: Frame; note: string }
  | { kind: 'run-microtask'; frameId: string }
  | { kind: 'run-macrotask'; frameId: string }
  | { kind: 'tick'; note: string };

export type Scenario = {
  id: string;
  title: string;
  code: string;
  description: string;
  steps: Step[];
  expected: string[];
};

const S = (
  id: string,
  title: string,
  description: string,
  code: string,
  steps: Step[],
  expected: string[],
): Scenario => ({
  id,
  title,
  description,
  code,
  steps,
  expected,
});

const promiseAndTimer: Scenario = S(
  'promise-vs-timer',
  'Promise vs setTimeout',
  'Microtasks drain before the next macrotask.',
  `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
  [
    { kind: 'push', frame: { id: 'f1', label: 'console.log("A")' } },
    { kind: 'log', value: 'A' },
    { kind: 'pop', frameId: 'f1' },
    {
      kind: 'schedule-macrotask',
      frame: { id: 't1', label: 'setTimeout cb' },
      note: 'setTimeout hands its callback to Web APIs.',
    },
    {
      kind: 'schedule-microtask',
      frame: { id: 'm1', label: 'Promise.then cb' },
      note: 'Promise.resolve().then queues a microtask.',
    },
    { kind: 'push', frame: { id: 'f2', label: 'console.log("D")' } },
    { kind: 'log', value: 'D' },
    { kind: 'pop', frameId: 'f2' },
    { kind: 'tick', note: 'Call stack is empty. Drain microtasks first.' },
    { kind: 'run-microtask', frameId: 'm1' },
    { kind: 'log', value: 'C' },
    { kind: 'tick', note: 'Microtask queue empty. Pull next macrotask.' },
    { kind: 'run-macrotask', frameId: 't1' },
    { kind: 'log', value: 'B' },
  ],
  ['A', 'D', 'C', 'B'],
);

const chainedMicrotasks: Scenario = S(
  'chained-microtasks',
  'Chained microtasks',
  'A microtask can enqueue another microtask before yielding.',
  `console.log('A');
Promise.resolve()
  .then(() => {
    console.log('B');
    return Promise.resolve();
  })
  .then(() => console.log('C'));
console.log('D');`,
  [
    { kind: 'push', frame: { id: 'f1', label: 'console.log("A")' } },
    { kind: 'log', value: 'A' },
    { kind: 'pop', frameId: 'f1' },
    {
      kind: 'schedule-microtask',
      frame: { id: 'm1', label: '.then #1' },
      note: 'First .then is queued as a microtask.',
    },
    { kind: 'push', frame: { id: 'f2', label: 'console.log("D")' } },
    { kind: 'log', value: 'D' },
    { kind: 'pop', frameId: 'f2' },
    { kind: 'tick', note: 'Drain microtasks.' },
    { kind: 'run-microtask', frameId: 'm1' },
    { kind: 'log', value: 'B' },
    {
      kind: 'schedule-microtask',
      frame: { id: 'm2', label: '.then #2' },
      note: 'Second .then queues while draining.',
    },
    { kind: 'run-microtask', frameId: 'm2' },
    { kind: 'log', value: 'C' },
  ],
  ['A', 'D', 'B', 'C'],
);

const twoTimers: Scenario = S(
  'two-timers',
  'Two zero-timers',
  'Timers with delay 0 still run after all microtasks.',
  `setTimeout(() => console.log('A'), 0);
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));`,
  [
    {
      kind: 'schedule-macrotask',
      frame: { id: 't1', label: 'setTimeout A' },
      note: 'First timer queued.',
    },
    {
      kind: 'schedule-macrotask',
      frame: { id: 't2', label: 'setTimeout B' },
      note: 'Second timer queued behind the first.',
    },
    {
      kind: 'schedule-microtask',
      frame: { id: 'm1', label: 'Promise.then' },
      note: 'Microtask queued.',
    },
    { kind: 'tick', note: 'Drain microtasks first.' },
    { kind: 'run-microtask', frameId: 'm1' },
    { kind: 'log', value: 'C' },
    { kind: 'tick', note: 'Now pull the first macrotask.' },
    { kind: 'run-macrotask', frameId: 't1' },
    { kind: 'log', value: 'A' },
    { kind: 'tick', note: 'Between macrotasks, microtasks would drain again.' },
    { kind: 'run-macrotask', frameId: 't2' },
    { kind: 'log', value: 'B' },
  ],
  ['C', 'A', 'B'],
);

export const scenarios: readonly Scenario[] = [promiseAndTimer, chainedMicrotasks, twoTimers];
