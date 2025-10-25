// app/dashboard/breeding/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useBisons } from "@/app/lib/BisonContext";
import { Bison } from "@/app/lib/data";

type GeneticOutcome = {
  genotype: string;
  probability: number;
  traits: {
    furLength: string;
    behavior: string;
    sociability: string;
    health: string;
  };
};

export default function BreedingPage() {
  const { bisons } = useBisons();
  const [parent1, setParent1] = useState<Bison | null>(null);
  const [parent2, setParent2] = useState<Bison | null>(null);
  const [results, setResults] = useState<GeneticOutcome[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Parse genotype string into genes
  const parseGenotype = (genotype: string) => {
    return {
      F: genotype.substring(0, 2), // Fur
      A: genotype.substring(2, 4), // Aggression
      S: genotype.substring(4, 6), // Sociability
      H: genotype.substring(6, 8), // Health
    };
  };

  // Get all allele combinations for a gene
  const getCombinations = (gene1: string, gene2: string): string[] => {
    const alleles = [
      gene1[0] + gene2[0],
      gene1[0] + gene2[1],
      gene1[1] + gene2[0],
      gene1[1] + gene2[1],
    ].map(combo => {
      // sort: dominant allele first
      return combo
        .split("")
        .sort((a, b) => {
          if (a === b) return 0;
          return a === a.toUpperCase() ? -1 : 1;
        })
        .join("");
    });

    return Array.from(new Set(alleles));
  };

  // Predict traits based on genotype
  const predictTraits = (F: string, A: string, S: string, H: string) => {
    const furLength = F.includes("F") ? "thick" : "normal";

    let behavior = "passive";
    if (A === "AA") behavior = "very aggressive";
    else if (A.includes("A")) behavior = "territorial/aggressive";
    else behavior = "calm/passive";

    let sociability = "moderate";
    if (S === "SS") sociability = "very social/playful";
    else if (S.includes("S")) sociability = "curious/alert";
    else sociability = "loner/lazy";

    let health = "healthy";
    if (H === "HH") health = "excellent";
    else if (H.includes("H")) health = "healthy";
    else health = "prone to issues";

    return { furLength, behavior, sociability, health };
  };

  // Main breeding calculation
const calculateOffspring = (): GeneticOutcome[] => {
  if (!parent1 || !parent2) return [];

  // Ensure opposite sexes
  if (parent1.sex === parent2.sex) {
    alert("Please select a male and a female bison.");
    return [];
  }

const normalize = (g?: string) => {
  if (typeof g !== "string") return "ffaaSsHh"; // fallback default genotype
  return g.replace(/[^A-Za-z]/g, "").padEnd(8, "f").substring(0, 8);
};

  const g1 = normalize(parent1.genotype);
  const g2 = normalize(parent2.genotype);

  const parse = (genotype: string) => ({
    F: genotype.substring(0, 2),
    A: genotype.substring(2, 4),
    S: genotype.substring(4, 6),
    H: genotype.substring(6, 8),
  });

  const genes1 = parse(g1);
  const genes2 = parse(g2);

  // helper to pick alleles with weighted randomness
  const getRandomAllele = (gene: string): string => {
    const [a1, a2] = gene.split("");
    // slightly higher chance for dominant alleles if heterozygous
    if (a1 !== a2 && Math.random() < 0.6) {
      return a1 === a1.toUpperCase() ? a1 : a2;
    }
    return Math.random() < 0.5 ? a1 : a2;
  };

  // Introduce slight mutation (1–5%)
  const maybeMutate = (allele: string): string => {
    if (Math.random() < 0.03) {
      return allele === allele.toUpperCase()
        ? allele.toLowerCase()
        : allele.toUpperCase();
    }
    return allele;
  };

  const results: Map<string, GeneticOutcome> = new Map();

  // simulate N offspring (statistical variety)
  const NUM_SIMULATIONS = 1000;

  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    const F =
      maybeMutate(getRandomAllele(genes1.F)) +
      maybeMutate(getRandomAllele(genes2.F));
    const A =
      maybeMutate(getRandomAllele(genes1.A)) +
      maybeMutate(getRandomAllele(genes2.A));
    const S =
      maybeMutate(getRandomAllele(genes1.S)) +
      maybeMutate(getRandomAllele(genes2.S));
    const H =
      maybeMutate(getRandomAllele(genes1.H)) +
      maybeMutate(getRandomAllele(genes2.H));

    // sort each pair (dominant first)
    const sortGene = (g: string) =>
      g.split("").sort((x, y) => (x === x.toUpperCase() ? -1 : 1)).join("");

    const g = sortGene(F) + sortGene(A) + sortGene(S) + sortGene(H);

    if (!results.has(g)) {
      results.set(g, {
        genotype: g,
        probability: 0,
        traits: predictTraits(sortGene(F), sortGene(A), sortGene(S), sortGene(H)),
      });
    }
    results.get(g)!.probability += 1 / NUM_SIMULATIONS;
  }

  return Array.from(results.values()).sort(
    (a, b) => b.probability - a.probability
  );
};

  // Available bisons for breeding
  const availableBisons = bisons.filter(
    b => b.healthCondition === "healthy" && !b.quarantine && b.age >= 3
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧬 Genetic Breeding Calculator
          </h1>
          <p className="text-gray-600">
            Select two parent wisents to predict offspring genetics
          </p>
        </div>

        {/* Parent selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Parent 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              🦬 Parent 1 {parent1?.sex === "male" ? "♂️" : "♀️"}
            </h2>

            {parent1 ? (
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={parent1.image}
                    alt={parent1.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {parent1.name}
                </h3>
                <div className="space-y-2 text-sm mb-4 text-gray-900">
                  <p>
                    <span className="font-semibold">Age:</span> {parent1.age} years
                  </p>
                  <p>
                    <span className="font-semibold">Behavior:</span>{" "}
                    {parent1.behavior}
                  </p>
                  <p>
                    <span className="font-semibold">Fur:</span> {parent1.furLength}
                  </p>
                  <p>
                    <span className="font-semibold">Region:</span> {parent1.region}
                  </p>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                    <span className="font-semibold">Genotype:</span>{" "}
                    {parent1.genotype}
                  </p>
                </div>
                <button
                  onClick={() => setParent1(null)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Change Parent
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableBisons.map(bison => (
                  <button
                    key={bison.id}
                    onClick={() => setParent1(bison)}
                    disabled={parent2?.id === bison.id}
                    className="w-full flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={bison.image}
                        alt={bison.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900">
                        {bison.name} {bison.sex === "male" ? "♂️" : "♀️"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {bison.age}y • {bison.behavior}
                      </p>
                      <p className="text-xs font-mono text-gray-500">
                        {bison.genotype}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Parent 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              🦬 Parent 2 {parent2?.sex === "male" ? "♂️" : "♀️"}
            </h2>

            {parent2 ? (
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={parent2.image}
                    alt={parent2.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {parent2.name}
                </h3>
                <div className="space-y-2 text-sm mb-4 text-gray-900">
                  <p>
                    <span className="font-semibold">Age:</span> {parent2.age} years
                  </p>
                  <p>
                    <span className="font-semibold">Behavior:</span>{" "}
                    {parent2.behavior}
                  </p>
                  <p>
                    <span className="font-semibold">Fur:</span> {parent2.furLength}
                  </p>
                  <p>
                    <span className="font-semibold">Region:</span> {parent2.region}
                  </p>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                    <span className="font-semibold">Genotype:</span>{" "}
                    {parent2.genotype}
                  </p>
                </div>
                <button
                  onClick={() => setParent2(null)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Change Parent
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableBisons.map(bison => (
                  <button
                    key={bison.id}
                    onClick={() => setParent2(bison)}
                    disabled={parent1?.id === bison.id}
                    className="w-full flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={bison.image}
                        alt={bison.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900">
                        {bison.name} {bison.sex === "male" ? "♂️" : "♀️"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {bison.age}y • {bison.behavior}
                      </p>
                      <p className="text-xs font-mono text-gray-500">
                        {bison.genotype}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Calculate Button */}
        {parent1 && parent2 && (
          <button
            onClick={() => {
              const outcomes = calculateOffspring();
              setResults(outcomes);
              setHasCalculated(true);
            }}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg mb-8"
          >
            🧬 Calculate Genetic Outcomes
          </button>
        )}

        {/* Results */}
        {hasCalculated && results.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🧬 Predicted Offspring Genetics
            </h2>

            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Gene Key:</strong> F=Fur, A=Aggression, S=Sociability,
                H=Health
              </p>
            </div>

            <div className="space-y-4">
              {results.map((outcome, idx) => (
                <div
                  key={idx}
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-green-500 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-mono text-lg font-bold text-gray-900">
                        {outcome.genotype}
                      </p>
                      <p className="text-sm text-gray-600">
                        Probability: {(outcome.probability * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="w-24 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${outcome.probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Fur
                      </p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {outcome.traits.furLength}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Behavior
                      </p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {outcome.traits.behavior}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Sociability
                      </p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {outcome.traits.sociability}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Health
                      </p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {outcome.traits.health}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No results yet */}
        {hasCalculated && results.length === 0 && (
          <p className="text-center text-gray-600 mt-4">
            No offspring combinations could be determined.
          </p>
        )}
      </div>
    </div>
  );
}