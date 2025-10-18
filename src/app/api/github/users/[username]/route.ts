import {
  withErrorMapping,
  ghFetchJSON,
} from "../../../../../lib/fetch-helpers";
import { UserSchema } from "../../../../../lib/github/validation";

export const GET = withErrorMapping(
  async (_req, { params }: { params: { username: string } }) => {
    const { username } = await params;
    const upstream = await ghFetchJSON(
      `/users/${encodeURIComponent(username)}`
    );
    const data = UserSchema.parse(upstream.body);
    return Response.json({
      name: data.name ?? null,
      login: data.login,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
    });
  }
);
