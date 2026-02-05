"use client";

import { useEffect, useState } from "react";

export function useChildrenIds() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("children");
    if (stored) {
      setIds(JSON.parse(stored));
    }
  }, []);

  return ids;
}
