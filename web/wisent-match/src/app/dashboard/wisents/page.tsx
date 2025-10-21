"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { regions, behaviors, healths } from "@/app/lib/data";
import { useBisons } from "@/app/lib/BisonContext";

export default function DashboardPage() {
  const { bisons } = useBisons();
  const [regionFilter, setRegionFilter] = useState<string[]>([]);
  const [healthFilter, setHealthFilter] = useState<string[]>([]);
  const [behaviorFilter, setBehaviorFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  const filteredBisons = bisons.filter((bison) => {
    if (regionFilter.length > 0 && !regionFilter.includes(bison.region))
      return false;
    if (
      healthFilter.length > 0 &&
      !healthFilter.includes(bison.healthCondition)
    )
      return false;
    if (behaviorFilter.length > 0 && !behaviorFilter.includes(bison.behavior))
      return false;
    return true;
  });

  const toggleFilter = (
    filterArray: string[],
    setFilter: (val: string[]) => void,
    item: string
  ) => {
    if (filterArray.includes(item)) {
      setFilter(filterArray.filter((i) => i !== item));
    } else {
      setFilter([...filterArray, item]);
    }
  };

  const clearAllFilters = () => {
    setRegionFilter([]);
    setHealthFilter([]);
    setBehaviorFilter([]);
  };

  const activeFilterCount =
    regionFilter.length + healthFilter.length + behaviorFilter.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Region Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Region{" "}
                  {regionFilter.length > 0 && `(${regionFilter.length})`}
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {regions.map((region) => (
                    <label
                      key={region}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={regionFilter.includes(region)}
                        onChange={() =>
                          toggleFilter(regionFilter, setRegionFilter, region)
                        }
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {region}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              {/* Behavior Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Behavior{" "}
                  {behaviorFilter.length > 0 && `(${behaviorFilter.length})`}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {behaviors.map((behavior) => (
                    <label
                      key={behavior}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={behaviorFilter.includes(behavior)}
                        onChange={() =>
                          toggleFilter(
                            behaviorFilter,
                            setBehaviorFilter,
                            behavior
                          )
                        }
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                        {behavior}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              {/* Health Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Health{" "}
                  {healthFilter.length > 0 && `(${healthFilter.length})`}
                </h3>
                <div className="space-y-2">
                  {healths.map((health) => (
                    <label
                      key={health}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={healthFilter.includes(health)}
                        onChange={() =>
                          toggleFilter(healthFilter, setHealthFilter, health)
                        }
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                        {health}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mt-4 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {showFilters
                ? "Hide Filters"
                : `Show Filters (${activeFilterCount})`}
            </button>
          </aside>

          {/* Bison Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Wisent Database
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredBisons.length} of {bisons.length} wisent
                {filteredBisons.length !== 1 && "s"}
              </p>
            </div>

            {filteredBisons.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No wisents found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBisons.map((bison) => (
                  <Link
                    key={bison.id}
                    href={`/dashboard/bison/${bison.id}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={bison.image}
                        alt={bison.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                            {bison.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {bison.age} years • {bison.sex}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {bison.quarantine && (
                            <span
                              className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"
                              title="Quarantine"
                            >
                              🚫
                            </span>
                          )}
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              bison.healthCondition === "healthy"
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                            title={bison.healthCondition}
                          >
                            {bison.healthCondition === "healthy" ? "✓" : "!"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>📍</span>
                          <span>{bison.region}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>🧬</span>
                          <span className="capitalize">{bison.behavior}</span>
                        </div>
                        {bison.flock && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <span>👥</span>
                            <span>{bison.flock}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}