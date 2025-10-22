// lib/AdvertContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { initialAdverts, type Advert } from "./data";

type AdvertContextType = {
  adverts: Advert[];
  addAdvert: (advert: Omit<Advert, "id" | "postedAt">) => void;
  deleteAdvert: (id: string) => void;
};

const AdvertContext = createContext<AdvertContextType | undefined>(
  undefined
);

export function AdvertProvider({ children }: { children: ReactNode }) {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("🔄 Loading adverts from localStorage...");
    const saved = localStorage.getItem("wisentmatch_adverts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("✅ Loaded adverts:", parsed);
        setAdverts(parsed);
      } catch (error) {
        console.error("❌ Failed to parse adverts:", error);
        setAdverts(initialAdverts);
      }
    } else {
      console.log("📝 No saved adverts, using initial");
      setAdverts(initialAdverts);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      console.log("💾 Saving adverts to localStorage:", adverts);
      localStorage.setItem("wisentmatch_adverts", JSON.stringify(adverts));
    }
  }, [adverts, isInitialized]);

  const addAdvert = (advertData: Omit<Advert, "id" | "postedAt">) => {
    console.log("➕ Adding new advert:", advertData);
    const newAdvert: Advert = {
      ...advertData,
      id: `adv${Date.now()}`,
      postedAt: new Date().toISOString().split("T")[0],
    };
    console.log("📋 New advert created:", newAdvert);
    setAdverts((prev) => {
      const updated = [newAdvert, ...prev];
      console.log("📊 Updated adverts list:", updated);
      return updated;
    });
  };

  const deleteAdvert = (id: string) => {
    console.log("🗑️ Deleting advert:", id);
    setAdverts((prev) => prev.filter((a) => a.id !== id));
  };

  if (!isInitialized) {
    return null;
  }

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