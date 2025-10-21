// lib/AdvertContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { initialAdverts, type Advert } from "./data";

type AdvertContextType = {
  adverts: Advert[];
  addAdvert: (advert: Omit<Advert, "id" | "postedAt">) => void;
  deleteAdvert: (id: string) => void;
};

const AdvertContext = createContext<AdvertContextType | undefined>(undefined);

export function AdvertProvider({ children }: { children: ReactNode }) {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wisentmatch_adverts");
    if (saved) {
      setAdverts(JSON.parse(saved));
    } else {
      setAdverts(initialAdverts);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("wisentmatch_adverts", JSON.stringify(adverts));
    }
  }, [adverts, loaded]);

  const addAdvert = (advertData: Omit<Advert, "id" | "postedAt">) => {
    const newAdvert: Advert = {
      ...advertData,
      id: Date.now().toString(),
      postedAt: new Date().toISOString().split("T")[0],
    };
    setAdverts((prev) => [newAdvert, ...prev]);
  };

  const deleteAdvert = (id: string) => {
    setAdverts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AdvertContext.Provider value={{ adverts, addAdvert, deleteAdvert }}>
      {children}
    </AdvertContext.Provider>
  );
}

export function useAdverts() {
  const context = useContext(AdvertContext);
  if (!context) {
    throw new Error("useAdverts must be used within AdvertProvider");
  }
  return context;
}