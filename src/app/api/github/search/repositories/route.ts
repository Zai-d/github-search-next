import { NextRequest } from "next/server";
import {
  ghFetchJSON,
  withErrorMapping,
} from "../../../../../lib/fetch-helpers";
import { z } from "zod";
import { SearchReposSchema } from "../../../../../lib/github/validation";
import {
  parseHasNextFromLink,
  capBySearchLimit,
} from "../../../../../lib/link-header";

const QuerySchema = z.object({
  q: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
});

export const GET = withErrorMapping(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.parse({
    q: searchParams.get("q"),
    page: searchParams.get("page") ?? "1",
    per_page: searchParams.get("per_page") ?? "20",
  });

  const upstream = await ghFetchJSON(
    `/search/repositories?q=${encodeURIComponent(parsed.q)}&page=${
      parsed.page
    }&per_page=${parsed.per_page}`
  );
  const data = SearchReposSchema.parse(upstream.body);

  const byCap = capBySearchLimit(parsed.page, parsed.per_page);
  const hasNext = byCap && parseHasNextFromLink(upstream.link);

  return Response.json(
    {
      total_count: data.total_count,
      items: data.items.map((r) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        owner: { login: r.owner.login },
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        open_issues_count: r.open_issues_count ?? 0,
        description: r.description,
        license: r.license ? { spdx_id: r.license.spdx_id ?? null } : null,
        fork: r.fork,
        private: r.private,
      })),
      hasNextPage: hasNext,
    },
    { status: 200 }
  );
});
