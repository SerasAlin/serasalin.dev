import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.github.com/users/:login', ({ params }) =>
    HttpResponse.json({
      login: params.login,
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.png',
      html_url: 'https://github.com/test',
      bio: null,
      company: null,
      location: null,
      public_repos: 5,
      followers: 10,
      following: 3,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    }),
  ),
  http.get('https://api.github.com/users/:login/repos', () =>
    HttpResponse.json([
      {
        id: 1,
        name: 'sample',
        full_name: 'test/sample',
        html_url: 'https://github.com/test/sample',
        description: 'A sample repo.',
        fork: false,
        archived: false,
        private: false,
        stargazers_count: 4,
        forks_count: 0,
        language: 'TypeScript',
        topics: ['nextjs'],
        pushed_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
      },
    ]),
  ),

  http.post('/api/contact', async ({ request }) => {
    const body = (await request.json()) as { email?: string };
    if (body.email === 'fail@example.com') {
      return HttpResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid email.' } },
        { status: 400 },
      );
    }
    return HttpResponse.json({ ok: true });
  }),
];
