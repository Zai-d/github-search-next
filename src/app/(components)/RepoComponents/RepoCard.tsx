"use client";

import { useInView } from "src/hooks/useIntersection";
import styles from "./Repos.module.css";
import { useEffect, useState } from "react";
import { BiStar } from "react-icons/bi";
import { FaCodeFork } from "react-icons/fa6";
import { VscIssues } from "react-icons/vsc";
import { GoLaw } from "react-icons/go";
import { LanguageIcon } from "src/lib/language-icons";
import { runLimited } from "src/lib/limit";

type Repo = {
  id: number;
  full_name: string; // owner/name
  name: string;
  owner: { login: string };
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license?: { spdx_id?: string | null } | null;
  topics?: string[]; // optional
  description?: string | null;
  fork?: boolean;
  private?: boolean;
};

type LanguagesMap = Record<string, number>;

export function RepoCard({ repo }: { repo: Repo }) {
  const [ref, inView] = useInView({ rootMargin: "150px" });
  const [languages, setLanguages] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    async function loadDetails() {
      if (!inView || loaded) return;
      try {
        await runLimited(async () => {
          const langsRes = await fetch(
            `/api/github/repos/${encodeURIComponent(
              repo.owner.login
            )}/${encodeURIComponent(repo.name)}/languages`,
            { signal: ac.signal }
          );

          if (langsRes.ok) {
            const obj: LanguagesMap = await langsRes.json();
            if (!cancelled) setLanguages(Object.keys(obj));
          }
        });
      } catch {
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    loadDetails();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [inView, repo.owner.login, repo.name, loaded]);

  return (
    <article
      ref={ref as any}
      className={styles.card}
      aria-label={`Repository ${repo.full_name}`}
    >
      <div>
        <div className={styles.header}>
          <h3 className={styles.repoName}>
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              {repo.full_name}
            </a>
          </h3>
        </div>
        {repo.description && (
          <p title={repo.description} className={styles.description}>
            {repo.description}
          </p>
        )}

        <div className={styles.meta} aria-label="Repository metrics">
          <span title="Stars">
            <BiStar /> {repo.stargazers_count}
          </span>
          <span title="Forks">
            <FaCodeFork /> {repo.forks_count}
          </span>
          <span title="Open issues">
            <VscIssues />
            {repo.open_issues_count}
          </span>
          {repo.license?.spdx_id && (
            <span title="License">
              <GoLaw />
              {repo.license.spdx_id}
            </span>
          )}
          {repo.fork && <span className="badge">Fork</span>}
          {repo.private && (
            <span className="badge" title="Private repository">
              Private
            </span>
          )}
        </div>
      </div>

      {!!languages?.length && (
        <div className={styles.badges}>
          {languages.map((l) => (
            <span key={l} className="badge">
              <LanguageIcon name={l} size={12} /> {l}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
