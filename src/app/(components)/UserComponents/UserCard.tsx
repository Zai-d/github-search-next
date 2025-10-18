"use client";

import { useInView } from "../../../hooks/useIntersection";
import styles from "./Users.module.css";
import { useEffect, useState } from "react";
import { fetchUserNameLimited } from "src/lib/userNameCache";

type BasicUser = {
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string | null;
};

export function UserCard({ user }: { user: BasicUser }) {
  const [ref, inView] = useInView({ rootMargin: "100px" });
  const [fullName, setFullName] = useState<string | null | undefined>(
    user.name
  );

  useEffect(() => {
    let cancelled = false;
    async function go() {
      if (!inView || fullName != null) return;
      const name = await fetchUserNameLimited(user.login);
      if (!cancelled) setFullName(name);
    }
    go();
    return () => {
      cancelled = true;
    };
  }, [inView, user.login, fullName]);
  return (
    <article
      ref={ref as any}
      className={styles.card}
      aria-label={`GitHub user ${user.login}`}
    >
      <img className={styles.avatar} src={user.avatar_url} alt="" />
      <div>
        <h3 className={styles.name}>
          <a href={user.html_url} target="_blank" rel="noreferrer">
            {fullName ?? user.login}
          </a>
        </h3>
        {fullName && <p className={styles.username}>@{user.login}</p>}
      </div>
    </article>
  );
}
