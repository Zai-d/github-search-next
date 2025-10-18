"use client";

import styles from "./TypeToggle.module.css";

export type SearchType = "users" | "repositories";

type Props = {
  value: SearchType;
  onChange: (t: SearchType) => void;
};

export function TypeToggle({ value, onChange }: Props) {
  return (
    <div className={styles.wrap} role="group" aria-label="Search type">
      <button
        type="button"
        className={styles.btn}
        aria-pressed={value === "repositories"}
        onClick={() => onChange("repositories")}
      >
        Repositories
      </button>
      <button
        type="button"
        className={styles.btn}
        aria-pressed={value === "users"}
        onClick={() => onChange("users")}
      >
        Users
      </button>
    </div>
  );
}
