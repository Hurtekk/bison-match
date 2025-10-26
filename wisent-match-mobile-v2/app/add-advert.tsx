import { Advert, behaviors, regions } from "@/app/lib/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AddAdvertScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    type: "offer" as "offer" | "request",
    title: "",
    description: "",
    breeder: "",
    region: "",
    behavior: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const e: string[] = [];
    if (!form.title.trim()) e.push("Title is required.");
    if (!form.description.trim()) e.push("Description is required.");
    if (!form.breeder.trim()) e.push("Your name is required.");
    setErrors(e);
    return e.length === 0;
  };

  const saveAdvert = async () => {
    if (!validate()) return;
    const newAdvert: Advert = {
      id: `adv-${Date.now()}`,
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      breeder: form.breeder.trim(),
      region: form.region || undefined,
      behavior: form.behavior || undefined,
      postedAt: new Date().toISOString().split("T")[0],
    };

    try {
      const stored = await AsyncStorage.getItem("wisentmatch_adverts");
      const parsed = stored ? JSON.parse(stored) : [];
      parsed.unshift(newAdvert);
      await AsyncStorage.setItem("wisentmatch_adverts", JSON.stringify(parsed));
      Alert.alert("Success", "Your advertisement was posted.");
      router.push("/marketplace");
    } catch (err) {
      console.error("Failed to save advert:", err);
      Alert.alert("Error", "Could not save your advertisement.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📢 Post Advertisement</Text>
        <Text style={styles.subtitle}>
          Create a new offer or request listing.
        </Text>

        {/* Errors */}
        {errors.length > 0 && (
          <View style={styles.errorBox}>
            {errors.map((e, i) => (
              <Text key={i} style={styles.errorText}>• {e}</Text>
            ))}
          </View>
        )}

        {/* Type Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Listing Type *</Text>
          <View style={styles.row}>
            {[
              { value: "offer", label: "Offer", icon: "💰" },
              { value: "request", label: "Request", icon: "🔍" },
            ].map((opt) => {
              const active = form.type === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setForm({ ...form, type: opt.value as any })}
                  style={[styles.optionBtn, active && (opt.value === "offer"
                    ? { borderColor: "#16a34a", backgroundColor: "#dcfce7" }
                    : { borderColor: "#3b82f6", backgroundColor: "#dbeafe" })]}
                >
                  <Text style={active ? styles.optionTextActive : styles.optionText}>
                    {opt.icon} {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Listing Details</Text>

          <Input
            label="Title *"
            placeholder="e.g., High-quality hay for winter"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
          />

          <Input
            label="Description *"
            placeholder="Describe the offer or request..."
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            multiline
          />

          <Input
            label="Your name / farm *"
            placeholder="Enter your name"
            value={form.breeder}
            onChange={(v) => setForm({ ...form, breeder: v })}
          />
        </View>

        {/* Optional filters */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Optional Filters</Text>
          <Text style={styles.subText}>
            Help others find your advertisement easier.
          </Text>

          <Text style={styles.label}>Region</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsWrap}>
              {regions.map((r) => {
                const active = form.region === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() =>
                      setForm({ ...form, region: active ? "" : r })
                    }
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {r}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <Text style={[styles.label, { marginTop: 10 }]}>Behavior</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsWrap}>
              {behaviors.map((b) => {
                const active = form.behavior === b;
                return (
                  <Pressable
                    key={b}
                    onPress={() =>
                      setForm({ ...form, behavior: active ? "" : b })
                    }
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {b}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <Pressable
            style={[styles.btn, { backgroundColor: "#e5e7eb" }]}
            onPress={() => router.back()}
          >
            <Text style={{ color: "#111", fontWeight: "600" }}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, { backgroundColor: "#15803d" }]}
            onPress={saveAdvert}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              Post Advertisement
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Small input component
function Input({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={[
          styles.input,
          multiline ? { height: 90, textAlignVertical: "top" } : {},
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scroll: { padding: 20, paddingBottom: 80 },
  title: { fontSize: 28, fontWeight: "700", color: "#111" },
  subtitle: { color: "#666", marginBottom: 16 },
  errorBox: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorText: { color: "#b91c1c", fontSize: 13 },
  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontWeight: "700", color: "#111", marginBottom: 10 },
  subText: { color: "#666", fontSize: 12, marginBottom: 10 },
  row: { flexDirection: "row", gap: 8 },
  optionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 14,
  },
  optionText: { fontWeight: "600", color: "#333" },
  optionTextActive: { color: "#166534", fontWeight: "700" },
  label: { fontWeight: "600", color: "#111", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: "white",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: "#dcfce7", borderColor: "#16a34a", borderWidth: 1 },
  chipText: { color: "#333", fontSize: 13 },
  chipTextActive: { color: "#166534", fontWeight: "700" },
  btnRow: { flexDirection: "row", gap: 8 },
  btn: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
  },
});