import { useCallback, useEffect, useState } from "react";

const KEY = "interca:savedJobs";

function read(): number[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useSavedJobs() {
  const [saved, setSaved] = useState<number[]>([]);

  useEffect(() => {
    setSaved(read());
  }, []);

  const persist = useCallback((next: number[]) => {
    setSaved(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (jobId: number) => {
      const current = read();
      const next = current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId];
      persist(next);
    },
    [persist]
  );

  const isSaved = useCallback((jobId: number) => saved.includes(jobId), [saved]);

  return { saved, toggle, isSaved };
}
