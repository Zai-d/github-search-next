import { fetchGithub } from "./github/client";

export async function ghFetchJSON(
  path: string
): Promise<{ body: any; link?: string | null; res: Response }> {
  const res = await fetchGithub(path);
  const text = await res.text();
  let body: any;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const message =
      body && body.message ? body.message : `GitHub API error (${res.status})`;
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      headers[k] = String(v);
    });
    const err: any = new Error(message);
    err.status = res.status;
    err.headers = headers;
    throw err;
  }
  return { body, link: res.headers.get("Link"), res };
}

export function withErrorMapping<
  T extends (...args: any[]) => Promise<Response>
>(handler: T) {
  return async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (e: any) {

      if (e?.status === 403 && e?.headers?.["x-ratelimit-remaining"] === "0") {
        const reset = e?.headers?.["x-ratelimit-reset"];
        const message =
          "GitHub Search API rate limit exceeded. Please wait a minute and try again.";
        return Response.json({ message }, { status: 429 });
      }
      const message = e?.message || "Unexpected server error.";
      return Response.json({ message }, { status: e?.status || 500 });
    }
  };
}
