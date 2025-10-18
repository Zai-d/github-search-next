import styles from "./ForkersList.module.css";

type ForkUser = {
  owner: { login: string; avatar_url: string };
  html_url: string;
};

export function ForkersList({ forks }: { forks: ForkUser[] }) {
  if (!forks?.length) return null;
  return (
    <div className={styles.list} aria-label="Recent forks">
      {forks.map((f, i) => (
        <a
          key={i}
          href={f.html_url}
          target="_blank"
          rel="noreferrer"
          className="forker"
        >
          <img src={f.owner.avatar_url} alt="" /> <span>{f.owner.login}</span>
        </a>
      ))}
    </div>
  );
}
