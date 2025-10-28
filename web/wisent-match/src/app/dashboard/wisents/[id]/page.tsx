"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useBisons } from "@/app/lib/BisonContext";

export default function BisonProfilePage() {
  const { id } = useParams();
  const { bisons } = useBisons();
  const router = useRouter();

  const bison = bisons.find((b) => b.id === id);

  if (!bison) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Bison not found 🦬
        </h2>
        <p className="text-gray-600 mb-4">
          The requested bison could not be found in the database.
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Top Section: Image + Basic Info */}
        <div className="relative h-80 w-full bg-gray-100">
          <Image
            src={bison.image}
            alt={bison.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{bison.name}</h1>
            <Link
              href="/dashboard"
              className="text-sm text-green-700 hover:underline"
            >
              ← Back to list
            </Link>
          </div>

          <p className="text-gray-600 mb-4">
            {bison.age} years • {bison.sex === "male" ? "♂️ Male" : "♀️ Female"}
          </p>

          {/* Health Tag */}
          <p
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
              bison.healthCondition === "healthy"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {bison.healthCondition === "healthy" ? "🩺 Healthy" : "⚠️ Injured"}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-1">Behavior</h3>
              <p className="capitalize">{bison.behavior}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-1">Region</h3>
              <p>{bison.region}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-1">Fur Length</h3>
              <p>{bison.furLength}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-1">Genotype</h3>
              <p className="font-mono text-sm bg-white border border-gray-200 rounded px-2 py-1 inline-block">
                {bison.genotype}
              </p>
            </div>
          </div>

          {/* Optional quarantine info */}
          {bison.quarantine && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
              🚫 This bison is currently under quarantine and unavailable for breeding.
            </div>
          )}

          {bison.flock && (
            <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 text-sm">
              👥 Member of flock: <strong>{bison.flock}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}