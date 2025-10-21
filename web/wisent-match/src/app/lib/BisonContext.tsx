// lib/BisonContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { initialBisons, type Bison } from "./data";

type BisonContextType = {
  bisons: Bison[];
  addBison: (bison: Omit<Bison, "id">) => void;
  updateBison: (id: string, updates: Partial<Bison>) => void;
  deleteBison: (id: string) => void;
};

const BisonContext = createContext<BisonContextType | undefined>(undefined);

export function BisonProvider({ children }: { children: ReactNode }) {
  const [bisons, setBisons] = useState<Bison[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wisentmatch_bisons");
    if (saved) {
      setBisons(JSON.parse(saved));
    } else {
      setBisons(initialBisons);
    }
    setLoaded(true);
  }, []);

  // Save to localStorage whenever bisons change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("wisentmatch_bisons", JSON.stringify(bisons));
    }
  }, [bisons, loaded]);

  const addBison = (bisonData: Omit<Bison, "id">) => {
    const newBison: Bison = {
      ...bisonData,
      id: Date.now().toString(),
    };
    setBisons((prev) => [newBison, ...prev]);
  };

  const updateBison = (id: string, updates: Partial<Bison>) => {
    setBisons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBison = (id: string) => {
    setBisons((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BisonContext.Provider value={{ bisons, addBison, updateBison, deleteBison }}>
      {children}
    </BisonContext.Provider>
  );
}

export function useBisons() {
  const context = useContext(BisonContext);
  if (!context) {
    throw new Error("useBisons must be used within BisonProvider");
  }
  return context;
}