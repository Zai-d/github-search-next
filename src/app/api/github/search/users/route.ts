import { NextRequest } from "next/server";
import {
  ghFetchJSON,
  withErrorMapping,
} from "../../../../../lib/fetch-helpers";
import { z } from "zod";
import { SearchUsersSchema } from "../../../../../lib/github/validation";
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
    `/search/users?q=${encodeURIComponent(parsed.q)}&page=${
      parsed.page
    }&per_page=${parsed.per_page}`
  );
  const data = SearchUsersSchema.parse(upstream.body);

  const byCap = capBySearchLimit(parsed.page, parsed.per_page);
  const hasNext = byCap && parseHasNextFromLink(upstream.link);

  return Response.json(
    {
      total_count: data.total_count,
      items: data.items.map((u) => ({
        id: u.id,
        login: u.login,
        avatar_url: u.avatar_url,
        html_url: u.html_url,
        // name intentionally omitted; fetched lazily if needed
      })),
      hasNextPage: hasNext,
    },
    { status: 200 }
  );
});
