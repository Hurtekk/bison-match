import { Bison, initialBisons } from "@/app/lib/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

export default function BreedingScreen() {
  const [allBisons, setAllBisons] = useState<Bison[]>([]);
  const [parent1, setParent1] = useState<Bison | null>(null);
  const [parent2, setParent2] = useState<Bison | null>(null);
  const [results, setResults] = useState<GeneticOutcome[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  // load bisons
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const stored = await AsyncStorage.getItem("wisentmatch_bisons");
        const custom = stored ? JSON.parse(stored) : [];
        setAllBisons([...initialBisons, ...custom]);
      };
      load();
    }, [])
  );

  const availableBisons = allBisons.filter(
    (b) => b.healthCondition === "healthy" && !b.quarantine && b.age >= 3
  );

  const predictTraits = (F: string, A: string, S: string, H: string) => {
    const furLength = F.includes("F") ? "thick" : "normal";
    let behavior = "calm/passive";
    if (A === "AA") behavior = "very aggressive";
    else if (A.includes("A")) behavior = "territorial/aggressive";

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

  const calculateOffspring = (): GeneticOutcome[] => {
    if (!parent1 || !parent2) return [];
    if (parent1.sex === parent2.sex) {
      Alert.alert("Invalid Pair", "Please select a male and a female wisent.");
      return [];
    }

    const normalize = (g?: string) => {
      if (typeof g !== "string") return "ffaaSsHh";
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

    const getRandomAllele = (gene: string): string => {
      const [a1, a2] = gene.split("");
      if (a1 !== a2 && Math.random() < 0.6) {
        return a1 === a1.toUpperCase() ? a1 : a2;
      }
      return Math.random() < 0.5 ? a1 : a2;
    };

    const maybeMutate = (allele: string): string => {
      if (Math.random() < 0.03) {
        return allele === allele.toUpperCase()
          ? allele.toLowerCase()
          : allele.toUpperCase();
      }
      return allele;
    };

    const results: Map<string, GeneticOutcome> = new Map();
    const NUM_SIM = 1000;

    for (let i = 0; i < NUM_SIM; i++) {
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
      results.get(g)!.probability += 1 / NUM_SIM;
    }

    return Array.from(results.values()).sort((a, b) => b.probability - a.probability);
  };

  const handleCalculate = () => {
    const outcomes = calculateOffspring();
    setResults(outcomes);
    setHasCalculated(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        <Text style={styles.title}>🧬 Genetic Breeding Calculator</Text>
        <Text style={styles.subtitle}>
          Select two parent wisents to predict offspring genetics.
        </Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* Parent 1 */}
          <ParentSelector
            label="Parent 1"
            bison={parent1}
            setBison={setParent1}
            otherId={parent2?.id}
            bisons={availableBisons}
          />
          {/* Parent 2 */}
          <ParentSelector
            label="Parent 2"
            bison={parent2}
            setBison={setParent2}
            otherId={parent1?.id}
            bisons={availableBisons}
          />
        </View>

        {parent1 && parent2 && (
          <Pressable style={styles.calcBtn} onPress={handleCalculate}>
            <Text style={styles.calcBtnText}>🧬 Calculate Outcomes</Text>
          </Pressable>
        )}

        {hasCalculated && results.length > 0 && (
          <View style={styles.resultsCard}>
            <Text style={styles.sectionTitle}>Predicted Offspring</Text>
            <View style={styles.legend}>
              <Text style={styles.legendText}>F = Fur, A = Aggression, S = Sociability, H = Health</Text>
            </View>

            {results.map((r, i) => (
              <View key={i} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.genotype}>{r.genotype}</Text>
                  <Text style={styles.prob}>
                    {(r.probability * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.traitsRow}>
                  <Trait label="Fur" value={r.traits.furLength} />
                  <Trait label="Behavior" value={r.traits.behavior} />
                  <Trait label="Sociability" value={r.traits.sociability} />
                  <Trait label="Health" value={r.traits.health} />
                </View>
              </View>
            ))}
          </View>
        )}

        {hasCalculated && results.length === 0 && (
          <Text style={{ textAlign: "center", color: "#666", marginTop: 20 }}>
            No valid offspring combinations.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Component for parent selection
function ParentSelector({
  label,
  bison,
  setBison,
  bisons,
  otherId,
}: {
  label: string;
  bison: Bison | null;
  setBison: (b: Bison | null) => void;
  bisons: Bison[];
  otherId?: string;
}) {
  return (
    <View style={styles.parentCard}>
      <Text style={styles.parentTitle}>
        {label} {bison ? (bison.sex === "male" ? "♂️" : "♀️") : ""}
      </Text>
      {bison ? (
        <View>
          <Image source={bison.image} style={styles.parentImage} />
          <Text style={styles.bisonName}>{bison.name}</Text>
          <Text style={styles.bisonMeta}>
            {bison.age} yrs • {bison.behavior}
          </Text>
          <Text style={styles.bisonMeta}>Region: {bison.region}</Text>
          <Text style={styles.genCode}>Genotype: {bison.genotype}</Text>

          <Pressable
            style={styles.changeBtn}
            onPress={() => setBison(null)}
          >
            <Text style={{ color: "#444", fontWeight: "600" }}>
              Change Parent
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={bisons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setBison(item)}
              disabled={otherId === item.id}
              style={[
                styles.selectItem,
                otherId === item.id && { opacity: 0.4 },
              ]}
            >
              <Image source={item.image} style={styles.selectImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.selectName}>
                  {item.name} {item.sex === "male" ? "♂️" : "♀️"}
                </Text>
                <Text style={styles.selectMeta}>
                  {item.age}y • {item.behavior}
                </Text>
                <Text style={styles.genCodeSmall}>{item.genotype}</Text>
              </View>
            </Pressable>
          )}
          style={{ height: 280 }}
        />
      )}
    </View>
  );
}

// --- Trait display component
function Trait({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.traitCard}>
      <Text style={styles.traitLabel}>{label}</Text>
      <Text style={styles.traitValue}>{value}</Text>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: "#111", marginBottom: 4 },
  subtitle: { color: "#666", marginBottom: 12 },
  parentCard: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  parentTitle: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
  parentImage: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginBottom: 6,
  },
  bisonName: { fontWeight: "700", color: "#111" },
  bisonMeta: { color: "#555", fontSize: 12 },
  genCode: {
    fontSize: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 4,
    color: "#333",
  },
  changeBtn: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 8,
    alignItems: "center",
  },
  selectItem: {
    flexDirection: "row",
    gap: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 6,
    alignItems: "center",
  },
  selectImg: { width: 56, height: 56, borderRadius: 8, backgroundColor: "#eee" },
  selectName: { fontWeight: "700", color: "#111" },
  selectMeta: { color: "#666", fontSize: 12 },
  genCodeSmall: {
    fontSize: 10,
    color: "#777",
    fontFamily: "monospace",
  },
  calcBtn: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 14,
  },
  calcBtnText: { color: "white", fontWeight: "700", fontSize: 16 },
  resultsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
    color: "#111",
  },
  legend: {
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    padding: 6,
    marginBottom: 10,
  },
  legendText: { fontSize: 12, color: "#1e3a8a" },
  resultItem: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genotype: { fontFamily: "monospace", fontSize: 14, fontWeight: "700" },
  prob: { fontSize: 13, color: "#15803d", fontWeight: "700" },
  traitsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  traitCard: {
    flexBasis: "48%",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 6,
  },
  traitLabel: { fontSize: 10, color: "#6b7280", fontWeight: "600" },
  traitValue: {
    fontSize: 12,
    color: "#111",
    fontWeight: "500",
    textTransform: "capitalize",
  },
});