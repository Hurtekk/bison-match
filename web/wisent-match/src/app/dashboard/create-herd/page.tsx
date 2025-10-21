// app/dashboard/create-herd/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useBisons } from "@/app/lib/BisonContext";
import { Bison } from "@/app/lib/data";
import { regions, behaviors, healths } from "@/app/lib/data";

type FlockTraits = {
  regions: string[];
  behaviors: string[];
  healths: string[];
};

export default function CreateHerdPage() {
  const router = useRouter();
  const [herdName, setHerdName] = useState("");
  const [traits, setTraits] = useState<FlockTraits>({
    regions: [],
    behaviors: [],
    healths: [],
  });
  const [preview, setPreview] = useState<Bison[]>([]);
  const { bisons } = useBisons();
  const [showPreview, setShowPreview] = useState(false);

  const toggleTrait = (
    category: keyof FlockTraits,
    value: string
  ) => {
    setTraits((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
    setShowPreview(false);
  };

  const generatePreview = () => {
    // Get available bison (not in quarantine, not in flock)
    const available = bisons.filter(
      (b) => !b.quarantine && !b.flock
    );

    // Score each bison based on matching traits
    const scored = available.map((bison) => {
      let score = 0;

      // Region match (30 points)
      if (traits.regions.length === 0 || traits.regions.includes(bison.region)) {
        score += 30;
      }

      // Behavior match (20 points)
      if (traits.behaviors.length === 0 || traits.behaviors.includes(bison.behavior)) {
        score += 20;
      }

      // Health match (20 points)
      if (traits.healths.length === 0 || traits.healths.includes(bison.healthCondition)) {
        score += 20;
      }

      return { bison, score };
    });

    // Sort by score and take top 6
    const selected = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((s) => s.bison);

    setPreview(selected);
    setShowPreview(true);
  };

  const createHerd = () => {
    if (!herdName.trim()) {
      alert("Please enter a herd name");
      return;
    }

    if (preview.length < 5) {
      alert("Need at least 5 members to create a herd");
      return;
    }

    // Save to localStorage
    const newFlock = {
      name: herdName,
      traits,
      members: preview,
      createdAt: new Date().toISOString(),
    };

    const existing = localStorage.getItem("wisentmatch_flocks");
    const flocks = existing ? JSON.parse(existing) : [];
    flocks.unshift(newFlock);
    localStorage.setItem("wisentmatch_flocks", JSON.stringify(flocks));

    // Redirect to herds page
    router.push("/dashboard/herds");
  };

  const activeTraitsCount =
    traits.regions.length + traits.behaviors.length + traits.healths.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👥 Create Herd
          </h1>
          <p className="text-gray-600">
            Define traits to automatically select matching bison
          </p>
        </div>

        <div className="space-y-6">
          {/* Herd Name */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Herd Name
            </label>
            <input
              type="text"
              value={herdName}
              onChange={(e) => setHerdName(e.target.value)}
              placeholder="Enter herd name"
              className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Traits Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Desired Traits
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Select traits to match bison. Leave empty to allow any value.
            </p>

            {/* Regions */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Regions {traits.regions.length > 0 && `(${traits.regions.length})`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => toggleTrait("regions", region)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      traits.regions.includes(region)
                        ? "bg-green-100 text-green-700 border-2 border-green-500"
                        : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
                    }`}
                  >
                    {traits.regions.includes(region) && "✓ "}
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* Behaviors */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Behaviors {traits.behaviors.length > 0 && `(${traits.behaviors.length})`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {behaviors.map((behavior) => (
                  <button
                    key={behavior}
                    onClick={() => toggleTrait("behaviors", behavior)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      traits.behaviors.includes(behavior)
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                        : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
                    }`}
                  >
                    {traits.behaviors.includes(behavior) && "✓ "}
                    {behavior}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* Health */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Health {traits.healths.length > 0 && `(${traits.healths.length})`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {healths.map((health) => (
                  <button
                    key={health}
                    onClick={() => toggleTrait("healths", health)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      traits.healths.includes(health)
                        ? "bg-purple-100 text-purple-700 border-2 border-purple-500"
                        : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
                    }`}
                  >
                    {traits.healths.includes(health) && "✓ "}
                    {health}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Preview Button */}
          <button
            onClick={generatePreview}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg shadow-sm"
          >
            🔍 Generate Herd Preview
          </button>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Selected Members ({preview.length})
              </h2>

              {preview.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">😔</span>
                  <p className="text-gray-600">
                    No available bison match your criteria
                  </p>
                </div>
              ) : preview.length < 5 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Only {preview.length} bison available. Need at least 5
                    to create a herd.
                  </p>
                </div>
              ) : null}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                {preview.map((bison) => (
                  <div key={bison.id} className="group">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2 ring-2 ring-green-200">
                      <Image
                        src={bison.image}
                        alt={bison.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 text-center">
                      {bison.name}
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      {bison.age} yrs • {bison.sex}
                    </p>
                    <p className="text-xs text-gray-500 text-center capitalize">
                      {bison.behavior}
                    </p>
                  </div>
                ))}
              </div>

              {preview.length >= 5 && (
                <button
                  onClick={createHerd}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg"
                >
                  ✅ Create Herd
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}