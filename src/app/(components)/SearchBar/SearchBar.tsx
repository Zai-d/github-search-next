"use client";

import { useDebouncedValue } from "src/hooks/useDebouncedValue";
import styles from "./SearchBar.module.css";
import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
};

export function SearchBar({ value, onChange, onClear }: Props) {
  const [internal, setInternal] = useState(value);
  const debounced = useDebouncedValue(internal, 500);

  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  useEffect(() => setInternal(value), [value]);

  return (
    <div className={styles.container} aria-live="polite">
      <label htmlFor="search-input" className="sr-only">
        Search GitHub
      </label>
      <input
        id="search-input"
        className={styles.input}
        placeholder="Search GitHub..."
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        aria-label="Search input"
      />
      {internal && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => {
            setInternal("");
            onClear();
          }}
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
    </div>
  );
}
