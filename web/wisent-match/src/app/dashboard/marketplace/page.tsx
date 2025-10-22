// app/dashboard/marketplace/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdverts } from "@/app/lib/AdvertContext";

export default function MarketplacePage() {
  const { adverts, deleteAdvert } = useAdverts();
  const [filter, setFilter] = useState<"all" | "offer" | "request">("all");

  const filteredAdverts = adverts.filter((advert) => {
    if (filter === "all") return true;
    return advert.type === filter;
  });

  const offerCount = adverts.filter((a) => a.type === "offer").length;
  const requestCount = adverts.filter((a) => a.type === "request").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📢 Giełda Hodowców
            </h1>
            <p className="text-gray-600">
              {filteredAdverts.length}{" "}
              {filteredAdverts.length === 1
                ? "ogłoszenie"
                : filteredAdverts.length < 5
                ? "ogłoszenia"
                : "ogłoszeń"}
            </p>
          </div>
          <Link
            href="/dashboard/marketplace/create"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            ➕ Dodaj Ogłoszenie
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              filter === "all"
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Wszystkie ({adverts.length})
          </button>
          <button
            onClick={() => setFilter("offer")}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              filter === "offer"
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            💰 Oferty ({offerCount})
          </button>
          <button
            onClick={() => setFilter("request")}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
              filter === "request"
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            🔍 Zapytania ({requestCount})
          </button>
        </div>

        {/* Listings */}
        {filteredAdverts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <span className="text-6xl mb-4 block">📢</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Brak ogłoszeń
            </h3>
            <p className="text-gray-600 mb-6">
              Dodaj pierwsze ogłoszenie na giełdzie
            </p>
            <Link
              href="/dashboard/marketplace/create"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Dodaj Ogłoszenie
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAdverts.map((advert) => (
              <div
                key={advert.id}
                className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-md transition-shadow ${
                  advert.type === "offer"
                    ? "border-l-green-500"
                    : "border-l-blue-500"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {advert.type === "offer" ? "💰" : "🔍"}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          {advert.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            advert.type === "offer"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {advert.type === "offer" ? "Oferta" : "Zapytanie"}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">
                        {advert.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {advert.region && (
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                            📍 {advert.region}
                          </span>
                        )}
                        {advert.behavior && (
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium capitalize">
                            🧬 {advert.behavior}
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👤 {advert.breeder}</span>
                        <span>•</span>
                        <span>
                          📅{" "}
                          {new Date(advert.postedAt).toLocaleDateString(
                            "pl-PL"
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Czy na pewno chcesz usunąć ogłoszenie "${advert.title}"?`
                          )
                        ) {
                          deleteAdvert(advert.id);
                        }
                      }}
                      className="ml-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}