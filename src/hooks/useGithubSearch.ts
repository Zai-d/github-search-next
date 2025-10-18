"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

type SearchType = "users" | "repositories";

const PER_PAGE_USERS = 20;
const PER_PAGE_REPOSITORIES = 10;

type PageResponse<T> = {
  total_count: number;
  items: T[];
  hasNextPage: boolean;
};

export function useGithubSearch({
  query,
  type,
}: {
  query: string;
  type: SearchType;
}) {
  const enabled = !!query;
  const PER_PAGE = type === "users" ? PER_PAGE_USERS : PER_PAGE_REPOSITORIES;
  const { data, error, isPending, fetchNextPage, hasNextPage, status } =
    useInfiniteQuery<PageResponse<any>, any>({
      enabled,
      queryKey: ["search", type, query, PER_PAGE],
      initialPageParam: 1,
      getNextPageParam: (lastPage, _pages, lastPageParam) => {
        return lastPage.hasNextPage ? Number(lastPageParam) + 1 : undefined;
      },
      queryFn: async ({ pageParam }) => {
        const url =
          type === "users"
            ? `/api/github/search/users?q=${encodeURIComponent(
                query
              )}&page=${pageParam}&per_page=${PER_PAGE}`
            : `/api/github/search/repositories?q=${encodeURIComponent(
                query
              )}&page=${pageParam}&per_page=${PER_PAGE}`;
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          const message = (() => {
            try {
              return JSON.parse(text).message;
            } catch {
              return text;
            }
          })();
          const err: any = new Error(message || "Request failed");
          // attach code for retry policy
          (err as any).status = res.status;
          throw err;
        }
        return res.json();
      },
    });

  return {
    pages: data?.pages ?? [],
    isEmpty: !isPending && (data?.pages?.[0]?.items?.length ?? 0) === 0,
    isPending,
    isError: status === "error",
    errorMessage: (error as any)?.message ?? "Something went wrong.",
    fetchNext: () => fetchNextPage(),
    hasNext: hasNextPage,
  };
}
