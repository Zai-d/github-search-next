"use client";

import { useGithubSearch } from "../../../hooks/useGithubSearch";
import { EmptyState } from "../EmptyState/EmptyState";
import { ErrorState } from "../ErrorState/ErrorState";
import { LoadMoreSentinel } from "../LoadMoreSentinel/LoadmoreSentinel";
import { SkeletonList } from "../Skeletons/Skeletons";
import { UserCard } from "./UserCard";
import styles from "./Users.module.css";

export function UsersList({ query }: { query: string }) {
  const {
    pages,
    isEmpty,
    isPending,
    isError,
    errorMessage,
    fetchNext,
    hasNext,
  } = useGithubSearch({ query, type: "users" });

  if (!query) return <EmptyState message="Type to search GitHub users." />;

  if (isError) return <ErrorState message={errorMessage} onRetry={fetchNext} />;

  if (isEmpty) return <EmptyState message="No users found." />;

  return (
    <>
      <div className={styles.container} role="list">
        {isPending ? (
          <SkeletonList count={6} />
        ) : (
          pages
            .flatMap((p) => p.items)
            .map((u) => (
              <div role="listitem" key={u.id}>
                <UserCard user={u} />
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
