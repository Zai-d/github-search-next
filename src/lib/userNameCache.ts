import { runLimited } from "./limit";

const nameCache = new Map<string, Promise<string | null>>();

export function fetchUserNameLimited(login: string): Promise<string | null> {
  if (nameCache.has(login)) return nameCache.get(login)!;

  const p = runLimited(async () => {
    const res = await fetch(`/api/github/users/${encodeURIComponent(login)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.name ?? null) as string | null;
  });

  nameCache.set(login, p);
  return p;
}
