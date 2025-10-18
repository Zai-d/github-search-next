import styles from "./Skeletons.module.css";

export function SkeletonCard() {
  return <div className={styles.card} aria-hidden="true" />;
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
