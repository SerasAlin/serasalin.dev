import type { Frame, Step } from './scenarios';

export type EventLoopState = {
  stack: Frame[];
  microtasks: Frame[];
  macrotasks: Frame[];
  webApis: Frame[];
  logs: string[];
  note: string;
  stepIndex: number;
};

export const initial: EventLoopState = {
  stack: [],
  microtasks: [],
  macrotasks: [],
  webApis: [],
  logs: [],
  note: 'Press play to walk through the scenario.',
  stepIndex: -1,
};

const drop = (list: Frame[], id: string): Frame[] => list.filter((f) => f.id !== id);

export const applyStep = (state: EventLoopState, step: Step): EventLoopState => {
  switch (step.kind) {
    case 'push':
      return { ...state, stack: [...state.stack, step.frame], note: `Push ${step.frame.label}` };
    case 'pop': {
      const top = state.stack[state.stack.length - 1];
      return { ...state, stack: state.stack.slice(0, -1), note: `Pop ${top?.label ?? ''}` };
    }
    case 'log':
      return { ...state, logs: [...state.logs, step.value], note: `console.log("${step.value}")` };
    case 'schedule-macrotask':
      return {
        ...state,
        macrotasks: [...state.macrotasks, step.frame],
        webApis: [...state.webApis, step.frame],
        note: step.note,
      };
    case 'schedule-microtask':
      return {
        ...state,
        microtasks: [...state.microtasks, step.frame],
        note: step.note,
      };
    case 'run-microtask': {
      const frame = state.microtasks.find((f) => f.id === step.frameId);
      if (!frame) return state;
      return {
        ...state,
        microtasks: drop(state.microtasks, frame.id),
        stack: [...state.stack, frame],
        note: `Run microtask: ${frame.label}`,
      };
    }
    case 'run-macrotask': {
      const frame = state.macrotasks.find((f) => f.id === step.frameId);
      if (!frame) return state;
      return {
        ...state,
        macrotasks: drop(state.macrotasks, frame.id),
        webApis: drop(state.webApis, frame.id),
        stack: [...state.stack, frame],
        note: `Run macrotask: ${frame.label}`,
      };
    }
    case 'tick':
      return { ...state, note: step.note };
  }
};

export const runToIndex = (steps: Step[], index: number): EventLoopState => {
  let state = initial;
  for (let i = 0; i <= index && i < steps.length; i += 1) {
    const step = steps[i]!;
    state = applyStep(state, step);
    state.stepIndex = i;
    // Auto-drain single-step stack pushes for logs — reducer above doesn't need
    // to; keeping this simple mirrors what the model teaches.
  }
  return state;
};
