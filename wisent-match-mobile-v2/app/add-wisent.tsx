import { behaviors, regions } from "@/app/lib/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AddWisentScreen() {
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

  const handleSaveBison = async () => {
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

    // Pobierz istniejące żubry
    const existing = await AsyncStorage.getItem("wisentmatch_bisons");
    const bisons = existing ? JSON.parse(existing) : [];

    const newBison = {
      id: `${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age),
      sex: formData.sex,
      behavior: formData.behavior,
      region: formData.region,
      furLength: formData.furLength,
      healthCondition: formData.healthCondition,
      image: require("@/assets/1.jpg"),
      createdAt: new Date().toISOString(),
    };

    bisons.unshift(newBison);
    await AsyncStorage.setItem("wisentmatch_bisons", JSON.stringify(bisons));

    Alert.alert("✅ Success", `Wisent "${formData.name}" was added!`);
    router.push("/");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8f9fa" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
    >
      <Text style={styles.title}>➕ Add Wisent</Text>
      <Text style={styles.subtitle}>Register a new wisent to the database</Text>

      {/* Errors */}
      {errors.length > 0 && (
        <View style={styles.errorBox}>
          <Text style={styles.errorHeader}>Please fix the following:</Text>
          {errors.map((err, i) => (
            <Text key={i} style={styles.errorText}>• {err}</Text>
          ))}
        </View>
      )}

      {/* Name */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter wisent name"
            value={formData.name}
            onChangeText={(value) => setFormData({ ...formData, name: value })}
          />
        </View>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>Age (years) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            value={formData.age}
            onChangeText={(value) => setFormData({ ...formData, age: value })}
            keyboardType="numeric"
          />
        </View>

        <View>
          <Text style={styles.label}>Sex *</Text>
          <View style={styles.row}>
            {[
              { value: "male", label: "Male", icon: "♂️" },
              { value: "female", label: "Female", icon: "♀️" },
            ].map((opt) => {
              const active = formData.sex === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() =>
                    setFormData({ ...formData, sex: opt.value as any })
                  }
                  style={[styles.selectBtn, active && styles.selectActive]}
                >
                  <Text style={[styles.selectText, active && styles.selectTextActive]}>
                    {opt.icon} {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* Region & Behavior */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location & Behavior</Text>
        <View style={styles.inputBlock}>
          <Text style={styles.label}>Region *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsWrap}>
              {regions.map((region) => {
                const active = formData.region === region;
                return (
                  <Pressable
                    key={region}
                    onPress={() =>
                      setFormData({ ...formData, region: region })
                    }
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {region}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>Behavior *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsWrap}>
              {behaviors.map((behavior) => {
                const active = formData.behavior === behavior;
                return (
                  <Pressable
                    key={behavior}
                    onPress={() =>
                      setFormData({ ...formData, behavior: behavior })
                    }
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextActive,
                      ]}
                    >
                      {behavior.charAt(0).toUpperCase() + behavior.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Fur & Health */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Physical Traits</Text>

        <Text style={styles.label}>Fur Length</Text>
        <View style={styles.row}>
          {[
            { value: "normal", label: "Normal", icon: "🧥" },
            { value: "thick", label: "Thick", icon: "🧥🧥" },
          ].map((option) => {
            const active = formData.furLength === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() =>
                  setFormData({ ...formData, furLength: option.value as any })
                }
                style={[styles.selectSmall, active && styles.selectActive]}
              >
                <Text
                  style={[styles.selectText, active && styles.selectTextActive]}
                >
                  {option.icon} {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 10 }]}>
          Health Condition
        </Text>
        <View style={styles.row}>
          {[
            { value: "healthy", label: "Healthy", icon: "✅" },
            { value: "injured", label: "Injured", icon: "🩹" },
          ].map((opt) => {
            const active = formData.healthCondition === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() =>
                  setFormData({
                    ...formData,
                    healthCondition: opt.value as any,
                  })
                }
                style={[
                  styles.selectSmall,
                  active &&
                    (opt.value === "healthy"
                      ? { borderColor: "#16a34a", backgroundColor: "#dcfce7" }
                      : { borderColor: "#dc2626", backgroundColor: "#fee2e2" }),
                ]}
              >
                <Text
                  style={[
                    styles.selectText,
                    active &&
                      (opt.value === "healthy"
                        ? { color: "#166534" }
                        : { color: "#991b1b" }),
                  ]}
                >
                  {opt.icon} {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.btnRow}>
        <Pressable
          style={[styles.btn, { backgroundColor: "#e5e7eb" }]}
          onPress={() => router.back()}
        >
          <Text style={{ color: "#111", fontWeight: "600" }}>Cancel</Text>
        </Pressable>
        <Pressable style={[styles.btn, { backgroundColor: "#15803d" }]} onPress={handleSaveBison}>
          <Text style={{ color: "white", fontWeight: "700" }}>Add Wisent</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "700", color: "#111" },
  subtitle: { marginBottom: 16, color: "#666" },
  errorBox: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorHeader: { color: "#991b1b", fontWeight: "700", marginBottom: 4 },
  errorText: { color: "#b91c1c" },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
    color: "#111",
  },
  inputBlock: { marginBottom: 12 },
  label: { fontWeight: "600", color: "#111", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: Platform.select({ ios: 12, android: 8 }),
    fontSize: 16,
  },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  selectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    alignItems: "center",
  },
  selectSmall: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectActive: { borderColor: "#16a34a", backgroundColor: "#dcfce7" },
  selectText: { color: "#333", fontSize: 13 },
  selectTextActive: { color: "#166534", fontWeight: "700" },
  chipsWrap: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    paddingBottom: 4,
  },
  chip: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
    borderWidth: 1.5,
  },
  chipText: { color: "#444", fontSize: 13 },
  chipTextActive: { color: "#166534", fontWeight: "600" },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  btn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
});