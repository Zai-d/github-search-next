import styles from "./ErrorState.module.css";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className={styles.errorContainer} role="alert">
      <p style={{ marginTop: 0, marginBottom: ".5rem" }}>{message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}
