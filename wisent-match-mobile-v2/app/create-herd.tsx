import {
    behaviors,
    Bison,
    healths,
    initialBisons,
    regions,
} from "@/app/lib/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type FlockTraits = {
  regions: string[];
  behaviors: string[];
  healths: string[];
};

export default function CreateHerd() {
  const [herdName, setHerdName] = useState("");
  const [traits, setTraits] = useState<FlockTraits>({
    regions: [],
    behaviors: [],
    healths: [],
  });
  const [preview, setPreview] = useState<Bison[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const toggleTrait = (category: keyof FlockTraits, value: string) => {
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
    const available = initialBisons.filter((b) => !b.quarantine && !b.flock);

    let candidates = available.filter((bison) => {
      if (traits.regions.length > 0 && !traits.regions.includes(bison.region))
        return false;
      if (
        traits.behaviors.length > 0 &&
        !traits.behaviors.includes(bison.behavior)
      )
        return false;
      if (
        traits.healths.length > 0 &&
        !traits.healths.includes(bison.healthCondition)
      )
        return false;
      return true;
    });

    if (candidates.length === 0) {
      setPreview([]);
      setShowPreview(true);
      return;
    }

    const behaviorGroups = {
      peaceful: ["calm", "passive", "careful", "cautious", "watchful"],
      friendly: ["playful", "social", "curious", "energetic"],
      aggressive: ["aggressive", "very aggressive", "territorial", "dominant"],
      neutral: ["alert", "lazy", "loner"],
    };

    const getGroup = (behavior: string): string => {
      for (const [group, behs] of Object.entries(behaviorGroups)) {
        if (behs.includes(behavior)) return group;
      }
      return "neutral";
    };

    const isIncompatible = (b1: string, b2: string) => {
      const g1 = getGroup(b1);
      const g2 = getGroup(b2);

      if (g1 === "aggressive" && (g2 === "peaceful" || g2 === "friendly"))
        return true;
      if (g2 === "aggressive" && (g1 === "peaceful" || g1 === "friendly"))
        return true;
      if (
        b1 === "loner" &&
        ["social", "playful", "energetic"].includes(b2)
      )
        return true;
      if (
        b2 === "loner" &&
        ["social", "playful", "energetic"].includes(b1)
      )
        return true;
      return false;
    };

    const byBehavior: Record<string, Bison[]> = {};
    candidates.forEach((bison) => {
      if (!byBehavior[bison.behavior]) byBehavior[bison.behavior] = [];
      byBehavior[bison.behavior].push(bison);
    });

    let selected: Bison[] = [];
    const behaviorCounts = Object.entries(byBehavior)
      .map(([behavior, list]) => ({ behavior, count: list.length }))
      .sort((a, b) => b.count - a.count);

    if (behaviorCounts.length > 0) {
      const primary = behaviorCounts[0].behavior;
      selected.push(...byBehavior[primary]);

      for (const { behavior } of behaviorCounts.slice(1)) {
        if (!isIncompatible(primary, behavior)) {
          selected.push(...byBehavior[behavior]);
        }
      }
    }

    if (selected.length === 0) selected = candidates;

    const scored = selected.map((bison) => {
      let score = 0;
      if (bison.healthCondition === "healthy") score += 30;
      if (bison.age >= 3 && bison.age <= 12) score += 20;
      const group = getGroup(bison.behavior);
      if (group === "friendly") score += 15;
      else if (group === "peaceful") score += 12;
      else if (group === "neutral") score += 8;
      else if (group === "aggressive") score += 5;
      score += Math.random() * 3;
      return { bison, score };
    });

    const final = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => s.bison);

    setPreview(final);
    setShowPreview(true);
  };

  const createHerd = async () => {
    if (!herdName.trim()) {
      Alert.alert("Name required", "Please enter a herd name.");
      return;
    }
    if (preview.length < 5) {
      Alert.alert("Not enough members", "Need at least 5 members.");
      return;
    }

    const newFlock = {
      name: herdName,
      traits,
      members: preview,
      createdAt: new Date().toISOString(),
    };

    const existing = await AsyncStorage.getItem("wisentmatch_flocks");
    const flocks = existing ? JSON.parse(existing) : [];
    flocks.unshift(newFlock);
    await AsyncStorage.setItem("wisentmatch_flocks", JSON.stringify(flocks));

    router.push("/herds");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👥 Create Herd</Text>
      <Text style={styles.subtitle}>
        Define traits to automatically select matching wisent
      </Text>

      {/* Herd name */}
      <View style={styles.section}>
        <Text style={styles.label}>Herd Name</Text>
        <TextInput
          value={herdName}
          onChangeText={setHerdName}
          placeholder="Enter herd name"
          style={styles.input}
        />
      </View>

      {/* Regions */}
      <TraitSelector
        title="Regions"
        list={regions}
        selected={traits.regions}
        onToggle={(i) => toggleTrait("regions", i)}
      />

      {/* Behaviors */}
      <TraitSelector
        title="Behaviors"
        list={behaviors}
        selected={traits.behaviors}
        onToggle={(i) => toggleTrait("behaviors", i)}
      />

      {/* Healths */}
      <TraitSelector
        title="Health"
        list={healths}
        selected={traits.healths}
        onToggle={(i) => toggleTrait("healths", i)}
      />

      <Pressable style={styles.actionButton} onPress={generatePreview}>
        <Text style={styles.actionText}>🔍 Generate Herd Preview</Text>
      </Pressable>

      {showPreview && (
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>
            Selected Members ({preview.length})
          </Text>

          {preview.length === 0 ? (
            <Text style={styles.alertText}>
              😔 No available wisent match your criteria
            </Text>
          ) : null}

          <View style={styles.previewGrid}>
            {preview.map((bison) => (
              <View key={bison.id} style={styles.bisonCard}>
                <Image source={bison.image} style={styles.bisonImage} />
                <Text style={styles.bisonName}>{bison.name}</Text>
                <Text style={styles.bisonMeta}>
                  {bison.age} yrs • {bison.sex}
                </Text>
              </View>
            ))}
          </View>

          {preview.length >= 5 && (
            <Pressable style={styles.createButton} onPress={createHerd}>
              <Text style={styles.createButtonText}>✅ Create Herd</Text>
            </Pressable>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function TraitSelector({
  title,
  list,
  selected,
  onToggle,
}: {
  title: string;
  list: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>
        {title} {selected.length > 0 ? `(${selected.length})` : ""}
      </Text>
      <View style={styles.traitsWrap}>
        {list.map((item) => {
          const active = selected.includes(item);
          return (
            <Pressable
              key={item}
              onPress={() => onToggle(item)}
              style={[styles.traitBtn, active && styles.traitBtnActive]}
            >
              <Text
                style={[styles.traitText, active && styles.traitTextActive]}
              >
                {active ? "✓ " : ""}
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  subtitle: { color: "#666", marginBottom: 16 },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  label: { fontWeight: "700", color: "#111", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#111",
  },
  traitsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    columnGap: 8,
  },
  traitBtn: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  traitBtnActive: {
    backgroundColor: "#dcfce7",
    borderWidth: 1.5,
    borderColor: "#16a34a",
  },
  traitText: { color: "#333", fontSize: 13 },
  traitTextActive: { color: "#166534", fontWeight: "700" },
  actionButton: {
    backgroundColor: "#15803d",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  actionText: { color: "white", fontWeight: "700", fontSize: 16 },
  previewCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  previewTitle: { fontWeight: "700", fontSize: 18, color: "#111", marginBottom: 10 },
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  bisonCard: {
    width: "30%",
    alignItems: "center",
  },
  bisonImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: "#e5e7eb",
  },
  bisonName: {
    fontWeight: "600",
    fontSize: 13,
    color: "#111",
  },
  bisonMeta: {
    fontSize: 11,
    color: "#666",
  },
  alertText: { textAlign: "center", color: "#666", paddingVertical: 10 },
  createButton: {
    backgroundColor: "#15803d",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 16,
  },
  createButtonText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
  },
});