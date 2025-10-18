"use client";

import { EmptyState } from "@components/EmptyState/EmptyState";
import styles from "./Repos.module.css";
import { RepoCard } from "./RepoCard";
import { useGithubSearch } from "src/hooks/useGithubSearch";
import { SkeletonList } from "@components/Skeletons/Skeletons";
import { ErrorState } from "@components/ErrorState/ErrorState";
import { LoadMoreSentinel } from "@components/LoadMoreSentinel/LoadmoreSentinel";

export function ReposList({ query }: { query: string }) {
  const {
    pages,
    isEmpty,
    isPending,
    isError,
    errorMessage,
    fetchNext,
    hasNext,
  } = useGithubSearch({ query, type: "repositories" });

  if (!query)
    return <EmptyState message="Type to search GitHub repositories." />;

  if (isError) return <ErrorState message={errorMessage} onRetry={fetchNext} />;

  if (isEmpty) return <EmptyState message="No repositories found." />;

  return (
    <>
      <div className={styles.container} role="list">
        {isPending ? (
          <SkeletonList count={6} />
        ) : (
          pages
            .flatMap((p) => p.items)
            .map((r) => (
              <div role="listitem" key={r.id}>
                <RepoCard repo={r} />
              </div>
            ))
        )}
      </div>
      {!isPending && (
        <LoadMoreSentinel onLoadMore={fetchNext} hasMore={hasNext} />
      )}
    </>
  );
}
