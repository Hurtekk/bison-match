// app/dashboard/marketplace/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { regions, behaviors } from "@/app/lib/data";
import { useAdverts } from "@/app/lib/AdvertContext";

export default function CreateAdvertPage() {
  const router = useRouter();
  const { addAdvert } = useAdverts();
  const [formData, setFormData] = useState({
    type: "offer" as "offer" | "request",
    title: "",
    description: "",
    breeder: "",
    region: "",
    behavior: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!formData.title.trim()) newErrors.push("Title is required");
    if (!formData.description.trim())
      newErrors.push("Description is required");
    if (!formData.breeder.trim()) newErrors.push("Your name is required");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    addAdvert({
      type: formData.type,
      title: formData.title,
      description: formData.description,
      breeder: formData.breeder,
      region: formData.region || undefined,
      behavior: formData.behavior || undefined,
    });

    router.push("/dashboard/marketplace");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📢 Post Listing
          </h1>
          <p className="text-gray-600">
            Create a new offer or request listing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <h3 className="text-red-800 font-semibold mb-2">
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="text-red-700 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Type Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Listing Type *
            </label>
            <div className="flex gap-4">
              {[
                { value: "offer", label: "Offer", icon: "💰", desc: "I have something to offer" },
                { value: "request", label: "Request", icon: "🔍", desc: "I'm looking for something" },
              ].map((option) => (
                <label key={option.value} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={formData.type === option.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "offer" | "request",
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`px-5 py-4 border-2 rounded-lg transition-all ${
                      formData.type === option.value
                        ? option.value === "offer"
                          ? "border-green-500 bg-green-50"
                          : "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <div className="text-center mb-2">
                      <span className="text-3xl block mb-2">{option.icon}</span>
                      <span className={`font-semibold ${
                        formData.type === option.value
                          ? option.value === "offer"
                            ? "text-green-700"
                            : "text-blue-700"
                          : "text-gray-900"
                      }`}>
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 text-center">
                      {option.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Listing Details
            </h2>

            {/* Title */}
            <div className="mb-5">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., High-quality hay for winter"
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Provide details about your listing..."
                rows={4}
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Breeder Name */}
            <div>
              <label
                htmlFor="breeder"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Your Name *
              </label>
              <input
                id="breeder"
                type="text"
                value={formData.breeder}
                onChange={(e) =>
                  setFormData({ ...formData, breeder: e.target.value })
                }
                placeholder="Enter your name or farm name"
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Optional Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Optional Filters
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Help buyers/sellers find your listing more easily
            </p>

            {/* Region */}
            <div className="mb-5">
              <label
                htmlFor="region"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Region (Optional)
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900"
              >
                <option value="">Any region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Behavior */}
            <div>
              <label
                htmlFor="behavior"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Behavior (Optional)
              </label>
              <select
                id="behavior"
                value={formData.behavior}
                onChange={(e) =>
                  setFormData({ ...formData, behavior: e.target.value })
                }
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900"
              >
                <option value="">Any behavior</option>
                {behaviors.map((behavior) => (
                  <option key={behavior} value={behavior}>
                    {behavior.charAt(0).toUpperCase() + behavior.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/marketplace")}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              Post Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}