import {
  withErrorMapping,
  ghFetchJSON,
} from "../../../../../../../lib/fetch-helpers";
import { z } from "zod";

export const GET = withErrorMapping(
  async (_req, { params }: { params: { owner: string; repo: string } }) => {
    const { owner, repo } = await params;
    const upstream = await ghFetchJSON(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
        repo
      )}/languages`
    );

    const LanguagesSchema = z.record(z.number().nonnegative());
    const data = LanguagesSchema.parse(upstream.body);
    return Response.json(data);
  }
);
