export type SearchUsers = {
  total_count: number;
  items: Array<{
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  }>;
};

export type SearchRepos = {
  total_count: number;
  items: Array<{
    id: number;
    name: string;
    full_name: string;
    owner: { login: string };
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    license?: { spdx_id?: string | null } | null;
    fork?: boolean;
    private?: boolean;
    description?: string | null;
  }>;
};

export type User = {
  login: string;
  name: string | null;
  html_url: string;
  avatar_url: string;
};
