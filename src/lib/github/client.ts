const API_BASE = "https://api.github.com";
const UA = "next-github-search";

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;

  const base: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": UA,
  };
  if (token) (base as any).Authorization = `Bearer ${token}`;
  return base;
}

export async function fetchGithub(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const url = `${API_BASE}${path}`;
  const merged: RequestInit = {
    ...init,
    headers: {
      ...headers(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  };

  let attempt = 0;
  while (true) {
    const res = await fetch(url, merged);
    if (res.status === 503 && attempt < 2) {
      attempt++;
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 600));
      continue;
    }
    return res;
  }
}
