// app/dashboard/herds/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { type Bison } from "@/app/lib/data";

type Flock = {
  name: string;
  traits: {
    regions?: string[];
    behaviors?: string[];
    healths?: string[];
  };
  members: Bison[];
  createdAt: string;
};

export default function HerdsPage() {
  const [flocks, setFlocks] = useState<Flock[]>([]);

  // Load flocks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wisentmatch_flocks");
    if (saved) {
      setFlocks(JSON.parse(saved));
    }
  }, []);

  const deleteHerd = (index: number) => {
    const updated = flocks.filter((_, i) => i !== index);
    setFlocks(updated);
    localStorage.setItem("wisentmatch_flocks", JSON.stringify(updated));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🐂 Herds</h1>
          <p className="text-gray-600">
            {flocks.length} herd{flocks.length !== 1 && "s"} created
          </p>
        </div>

        {flocks.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <span className="text-6xl mb-4 block">🐂</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No herds yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first herd to get started
            </p>
            <a
              href="/dashboard/create-herd"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Create Herd
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {flocks.map((flock, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {flock.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Created {new Date(flock.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete the herd "${flock.name}"?`
                        )
                      ) {
                        deleteHerd(index);
                      }
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>

                {/* Traits */}
                {(flock.traits.regions?.length ||
                  flock.traits.behaviors?.length ||
                  flock.traits.healths?.length) && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {flock.traits.regions?.map((region) => (
                      <span
                        key={region}
                        className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200"
                      >
                        📍 {region}
                      </span>
                    ))}
                    {flock.traits.behaviors?.map((behavior) => (
                      <span
                        key={behavior}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 capitalize"
                      >
                        🧬 {behavior}
                      </span>
                    ))}
                    {flock.traits.healths?.map((health) => (
                      <span
                        key={health}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200 capitalize"
                      >
                        💚 {health}
                      </span>
                    ))}
                  </div>
                )}

                {/* Members Grid */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Members ({flock.members.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {flock.members.map((member) => (
                      <a
                        key={member.id}
                        href={`/dashboard/bison/${member.id}`}
                        className="group"
                      >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2 ring-2 ring-green-200">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 text-center group-hover:text-green-600 transition-colors">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 text-center">
                          {member.age} yrs
                        </p>
                      </a>
                    ))}
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