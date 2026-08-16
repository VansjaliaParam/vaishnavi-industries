"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface EnquiryCtx {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  addMany: (ids: string[]) => void;
}

const Ctx = createContext<EnquiryCtx | null>(null);
const KEY = "enquiry.selection.v1";

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setIds(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const has = (id: string) => ids.includes(id);
  const toggle = (id: string) =>
    setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const remove = (id: string) => setIds((p) => p.filter((x) => x !== id));
  const clear = () => setIds([]);
  const addMany = (a: string[]) => setIds((p) => Array.from(new Set([...p, ...a])));

  return (
    <Ctx.Provider value={{ ids, count: ids.length, has, toggle, remove, clear, addMany }}>
      {children}
    </Ctx.Provider>
  );
}

export const useEnquiry = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useEnquiry must be used within EnquiryProvider");
  return c;
};
