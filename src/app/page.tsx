"use client";

import { ReposList } from "./(components)/RepoComponents/ReposList";
import { SearchBar } from "./(components)/SearchBar/SearchBar";
import {
  TypeToggle,
  type SearchType,
} from "./(components)/TypeToggle/TypeToggle";
import { UsersList } from "./(components)/UserComponents/UsersList";
import styles from "./page.module.css";
import { useState } from "react";

export default function Page() {
  const [type, setType] = useState<SearchType>("repositories");
  const [query, setQuery] = useState("");
  const handleTypeChange = (newType: SearchType) => {
    setType(newType);
    setQuery("");
  };

  return (
    <section aria-labelledby="search-heading">
      <div className={styles.controls}>
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />
        <TypeToggle value={type} onChange={handleTypeChange} />
      </div>

      {type === "users" ? (
        <UsersList query={query} />
      ) : (
        <ReposList query={query} />
      )}
    </section>
  );
}
