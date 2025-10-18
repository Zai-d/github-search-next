import { z } from "zod";

export const SearchUsersSchema = z.object({
  total_count: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      login: z.string(),
      avatar_url: z.string().url(),
      html_url: z.string().url(),
    })
  ),
});

export const RepoOwnerSchema = z.object({
  login: z.string(),
});

export const SearchReposSchema = z.object({
  total_count: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      full_name: z.string(),
      owner: RepoOwnerSchema,
      html_url: z.string().url(),
      stargazers_count: z.number(),
      forks_count: z.number(),
      open_issues_count: z.number().optional(),
      license: z
        .object({ spdx_id: z.string().nullable().optional() })
        .nullable()
        .optional(),
      description: z.string().nullable().optional(),
      fork: z.boolean().optional(),
      private: z.boolean().optional(),
    })
  ),
});

export const UserSchema = z.object({
  login: z.string(),
  name: z.string().nullable().optional(),
  html_url: z.string().url(),
  avatar_url: z.string().url(),
});
