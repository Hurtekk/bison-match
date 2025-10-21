// app/dashboard/stats/page.tsx
"use client";

import { useBisons } from "@/app/lib/BisonContext";
import { regions, behaviors } from "@/app/lib/data";

export default function StatsPage() {
  const { bisons } = useBisons();

  // Basic stats
  const totalBisons = bisons.length;
  const healthyCount = bisons.filter((b) => b.healthCondition === "healthy").length;
  const injuredCount = bisons.filter((b) => b.healthCondition === "injured").length;
  const quarantinedCount = bisons.filter((b) => b.quarantine).length;
  const avgAge = totalBisons > 0
    ? (bisons.reduce((sum, b) => sum + b.age, 0) / totalBisons).toFixed(1)
    : "0";

  // Gender stats
  const maleCount = bisons.filter((b) => b.sex === "male").length;
  const femaleCount = bisons.filter((b) => b.sex === "female").length;

  // Fur stats
  const normalFurCount = bisons.filter((b) => b.furLength === "normal").length;
  const thickFurCount = bisons.filter((b) => b.furLength === "thick").length;

  // Region stats
  const regionStats = regions
    .map((region) => ({
      name: region,
      count: bisons.filter((b) => b.region === region).length,
    }))
    .sort((a, b) => b.count - a.count);

  const maxRegionCount = Math.max(...regionStats.map((r) => r.count), 1);

  // Behavior stats
  const behaviorStats = behaviors
    .map((behavior) => ({
      name: behavior,
      count: bisons.filter((b) => b.behavior === behavior).length,
    }))
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxBehaviorCount = Math.max(...behaviorStats.map((b) => b.count), 1);

  // Age distribution
  const ageGroups = [
    { label: "0-5 years", min: 0, max: 5 },
    { label: "6-10 years", min: 6, max: 10 },
    { label: "11-15 years", min: 11, max: 15 },
    { label: "16-20 years", min: 16, max: 20 },
    { label: "21+ years", min: 21, max: 100 },
  ];

  const ageDistribution = ageGroups.map((group) => ({
    label: group.label,
    count: bisons.filter((b) => b.age >= group.min && b.age <= group.max).length,
  }));

  const maxAgeCount = Math.max(...ageDistribution.map((a) => a.count), 1);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Statistics
          </h1>
          <p className="text-gray-600">Overview of all wisents in the database</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-4xl mb-3">🦬</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {totalBisons}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Wisents</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-4xl mb-3">✅</div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {healthyCount}
            </div>
            <div className="text-sm text-gray-600 font-medium">Healthy</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-4xl mb-3">🩹</div>
            <div className="text-3xl font-bold text-red-600 mb-1">
              {injuredCount}
            </div>
            <div className="text-sm text-gray-600 font-medium">Injured</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-4xl mb-3">🚫</div>
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {quarantinedCount}
            </div>
            <div className="text-sm text-gray-600 font-medium">Quarantined</div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Average Age */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Average Age
            </h3>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {avgAge}
              </div>
              <div className="text-gray-600">years</div>
            </div>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Gender Distribution
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">♂️</span>
                  <span className="text-sm font-medium text-gray-700">Male</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {maleCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${totalBisons > 0 ? (maleCount / totalBisons) * 100 : 0}%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">♀️</span>
                  <span className="text-sm font-medium text-gray-700">Female</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {femaleCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-pink-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${totalBisons > 0 ? (femaleCount / totalBisons) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Fur Length Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Fur Length
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧥</span>
                  <span className="text-sm font-medium text-gray-700">Normal</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {normalFurCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      totalBisons > 0 ? (normalFurCount / totalBisons) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧥🧥</span>
                  <span className="text-sm font-medium text-gray-700">Thick</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {thickFurCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${
                      totalBisons > 0 ? (thickFurCount / totalBisons) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Age Distribution
          </h2>
          <div className="space-y-4">
            {ageDistribution.map((group) => (
              <div key={group.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {group.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {group.count} wisent{group.count !== 1 && "s"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="from-green-500 to-green-600 bg-green-600 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{
                      width: `${(group.count / maxAgeCount) * 100}%`,
                    }}
                  >
                    {group.count > 0 && (
                      <span className="text-xs font-bold text-white">
                        {group.count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Region Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Distribution by Region
            </h2>
            <div className="space-y-4">
              {regionStats.map((region) => (
                <div key={region.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {region.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {region.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${(region.count / maxRegionCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Behavior Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Distribution by Behavior
            </h2>
            {behaviorStats.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {behaviorStats.map((behavior) => (
                  <div key={behavior.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {behavior.name}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {behavior.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{
                          width: `${(behavior.count / maxBehaviorCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}