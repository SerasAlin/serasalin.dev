export const queryKeys = {
  github: {
    all: ['github'] as const,
    summary: () => [...queryKeys.github.all, 'summary'] as const,
  },
  api: {
    me: ['api', 'me'] as const,
    projects: ['api', 'projects'] as const,
    now: ['api', 'now'] as const,
    lab: ['api', 'lab'] as const,
    skills: ['api', 'skills'] as const,
  },
} as const;
