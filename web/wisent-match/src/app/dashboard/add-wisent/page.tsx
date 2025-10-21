"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { regions, behaviors } from "@/app/lib/data";
import { useBisons } from "@/app/lib/BisonContext";

export default function AddWisentPage() {
  const router = useRouter();
  const { addBison } = useBisons();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "male" as "male" | "female",
    behavior: "",
    region: "",
    furLength: "normal" as "normal" | "thick",
    healthCondition: "healthy" as "healthy" | "injured",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push("Name is required");
    if (!formData.age || parseInt(formData.age) < 0)
      newErrors.push("Valid age is required");
    if (!formData.behavior) newErrors.push("Behavior is required");
    if (!formData.region) newErrors.push("Region is required");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add bison to context
    addBison({
      name: formData.name,
      age: parseInt(formData.age),
      sex: formData.sex,
      behavior: formData.behavior,
      region: formData.region,
      furLength: formData.furLength,
      healthCondition: formData.healthCondition,
      image: `/assets/${Math.floor(Math.random() * 30) + 1}.jpg`, // Random image
    });

    alert(`Wisent "${formData.name}" added successfully!`);
    router.push("/dashboard/wisents");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ➕ Add Wisent
          </h1>
          <p className="text-gray-600">Register a new wisent to the database</p>
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

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Basic Information
            </h2>

            {/* Name */}
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter wisent name"
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Age */}
            <div className="mb-5">
              <label
                htmlFor="age"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Age (years) *
              </label>
              <input
                id="age"
                type="number"
                min="0"
                max="30"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="Enter age"
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Sex *
              </label>
              <div className="flex gap-4">
                {[
                  { value: "male", label: "Male", icon: "♂️" },
                  { value: "female", label: "Female", icon: "♀️" },
                ].map((option) => (
                  <label key={option.value} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="sex"
                      value={option.value}
                      checked={formData.sex === option.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sex: e.target.value as "male" | "female",
                        })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`px-5 py-4 border-2 rounded-lg text-center transition-all ${
                        formData.sex === option.value
                          ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{option.icon}</span>
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Behavior */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Location & Behavior
            </h2>

            {/* Region */}
            <div className="mb-5">
              <label
                htmlFor="region"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Region *
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900"
              >
                <option value="">Select region...</option>
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
                Behavior *
              </label>
              <select
                id="behavior"
                value={formData.behavior}
                onChange={(e) =>
                  setFormData({ ...formData, behavior: e.target.value })
                }
                className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900"
              >
                <option value="">Select behavior...</option>
                {behaviors.map((behavior) => (
                  <option key={behavior} value={behavior}>
                    {behavior.charAt(0).toUpperCase() + behavior.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Physical Traits */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Physical Traits
            </h2>

            {/* Fur Length */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Fur Length
              </label>
              <div className="flex gap-4">
                {[
                  { value: "normal", label: "Normal", icon: "🧥" },
                  { value: "thick", label: "Thick", icon: "🧥🧥" },
                ].map((option) => (
                  <label key={option.value} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="furLength"
                      value={option.value}
                      checked={formData.furLength === option.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          furLength: e.target.value as "normal" | "thick",
                        })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`px-5 py-4 border-2 rounded-lg text-center transition-all ${
                        formData.furLength === option.value
                          ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{option.icon}</span>
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Health */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Health Condition
              </label>
              <div className="flex gap-4">
                {[
                  { value: "healthy", label: "Healthy", icon: "✅" },
                  { value: "injured", label: "Injured", icon: "🩹" },
                ].map((option) => (
                  <label key={option.value} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="healthCondition"
                      value={option.value}
                      checked={formData.healthCondition === option.value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          healthCondition: e.target.value as
                            | "healthy"
                            | "injured",
                        })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`px-5 py-4 border-2 rounded-lg text-center transition-all ${
                        formData.healthCondition === option.value
                          ? option.value === "healthy"
                            ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                            : "border-red-500 bg-red-50 text-red-700 font-semibold"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{option.icon}</span>
                      {option.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
            >
              Add Wisent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}