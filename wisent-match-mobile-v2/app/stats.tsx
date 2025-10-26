import { behaviors, Bison, initialBisons, regions } from "@/app/lib/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function StatsScreen() {
  const [bisons, setBisons] = useState<Bison[]>([]);

  const loadBisons = async () => {
    try {
      const stored = await AsyncStorage.getItem("wisentmatch_bisons");
      const userBisons = stored ? JSON.parse(stored) : [];
      setBisons([...initialBisons, ...userBisons]);
    } catch (err) {
      console.log("⚠️ stats load fail:", err);
      setBisons(initialBisons);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBisons();
    }, [])
  );

  if (bisons.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 24 }}>Brak danych 🦬</Text>
      </SafeAreaView>
    );
  }

  // Stats calculations
  const total = bisons.length;
  const healthy = bisons.filter((b) => b.healthCondition === "healthy").length;
  const injured = bisons.filter((b) => b.healthCondition === "injured").length;
  const quarantine = bisons.filter((b) => b.quarantine).length;
  const avgAge =
    total > 0
      ? (bisons.reduce((s, b) => s + b.age, 0) / total).toFixed(1)
      : "0";

  const male = bisons.filter((b) => b.sex === "male").length;
  const female = bisons.filter((b) => b.sex === "female").length;

  const normalFur = bisons.filter((b) => b.furLength === "normal").length;
  const thickFur = bisons.filter((b) => b.furLength === "thick").length;

  // group calculations
  const regionStats = regions
    .map((r) => ({
      name: r,
      count: bisons.filter((b) => b.region === r).length,
    }))
    .sort((a, b) => b.count - a.count);
  const maxRegion = Math.max(...regionStats.map((r) => r.count), 1);

  const behaviorStats = behaviors
    .map((r) => ({
      name: r,
      count: bisons.filter((b) => b.behavior === r).length,
    }))
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxBehavior = Math.max(...behaviorStats.map((r) => r.count), 1);

  const ageGroups = [
    { label: "0-5 years", min: 0, max: 5 },
    { label: "6-10 years", min: 6, max: 10 },
    { label: "11-15 years", min: 11, max: 15 },
    { label: "16-20 years", min: 16, max: 20 },
    { label: "21+ years", min: 21, max: 100 },
  ];
  const ageStats = ageGroups.map((group) => ({
    label: group.label,
    count: bisons.filter((b) => b.age >= group.min && b.age <= group.max).length,
  }));
  const maxAge = Math.max(...ageStats.map((a) => a.count), 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📊 Statistics</Text>
        <Text style={styles.subtitle}>
          Overview of all wisents in the database
        </Text>

        {/* Overview cards */}
        <View style={styles.rowWrap}>
          <StatCard icon="🦬" label="Total Wisents" value={total} color="#111" />
          <StatCard icon="✅" label="Healthy" value={healthy} color="#16a34a" />
          <StatCard icon="🩹" label="Injured" value={injured} color="#dc2626" />
          <StatCard icon="🚫" label="Quarantined" value={quarantine} color="#ea580c" />
        </View>

        {/* Avg Age & Gender & Fur */}
        <View style={{ gap: 16 }}>
          <View style={styles.card}>
            <Text style={styles.smallTitle}>Average Age</Text>
            <Text style={styles.bigNumber}>{avgAge}</Text>
            <Text style={styles.subText}>years</Text>
          </View>

          {/* Gender */}
          <View style={styles.card}>
            <Text style={styles.smallTitle}>Gender distribution</Text>
            <ProgressBar label="♂️ Male" value={male} max={total} color="#3b82f6" />
            <ProgressBar label="♀️ Female" value={female} max={total} color="#ec4899" />
          </View>

          {/* Fur */}
          <View style={styles.card}>
            <Text style={styles.smallTitle}>Fur Length</Text>
            <ProgressBar label="🧥 Normal" value={normalFur} max={total} color="#eab308" />
            <ProgressBar label="🧥🧥 Thick" value={thickFur} max={total} color="#f97316" />
          </View>
        </View>

        {/* Age distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Age distribution</Text>
          {ageStats.map((a) => (
            <ProgressBar
              key={a.label}
              label={a.label}
              value={a.count}
              max={maxAge}
              color="#16a34a"
              suffix=" wisents"
            />
          ))}
        </View>

        {/* Region */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Distribution by Region</Text>
          {regionStats.map((r) => (
            <ProgressBar
              key={r.name}
              label={r.name}
              value={r.count}
              max={maxRegion}
              color="#22c55e"
            />
          ))}
        </View>

        {/* Behavior */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Distribution by Behavior</Text>
          {behaviorStats.length === 0 ? (
            <Text style={styles.subText}>No data available</Text>
          ) : (
            behaviorStats.map((b) => (
              <ProgressBar
                key={b.name}
                label={b.name}
                value={b.count}
                max={maxBehavior}
                color="#3b82f6"
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// === REUSABLE COMPONENTS ===

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function ProgressBar({
  label,
  value,
  max,
  color,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  suffix?: string;
}) {
  const percent = max > 0 ? (value / max) * 100 : 0;
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={styles.progressLabelRow}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressValue}>
          {value}
          {suffix || ""}
        </Text>
      </View>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scroll: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: "700", color: "#111" },
  subtitle: { color: "#666", marginBottom: 20 },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    alignItems: "center",
  },
  icon: { fontSize: 36, marginBottom: 6 },
  value: { fontSize: 28, fontWeight: "700" },
  label: { color: "#555", fontSize: 12 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 18,
  },
  smallTitle: { fontWeight: "700", color: "#333", marginBottom: 10 },
  bigNumber: { fontSize: 44, fontWeight: "800", color: "#111", textAlign: "center" },
  subText: { fontSize: 12, textAlign: "center", color: "#666" },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111", marginBottom: 10 },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressLabel: { fontSize: 13, fontWeight: "600", color: "#333" },
  progressValue: { fontSize: 13, fontWeight: "700", color: "#111" },
  progressBg: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
});