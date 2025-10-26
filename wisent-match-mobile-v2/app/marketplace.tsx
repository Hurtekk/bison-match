import { Advert, initialAdverts } from "@/app/lib/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function MarketplaceScreen() {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [filter, setFilter] = useState<"all" | "offer" | "request">("all");

  const loadAdverts = async () => {
    try {
      const stored = await AsyncStorage.getItem("wisentmatch_adverts");
      const userAds = stored ? JSON.parse(stored) : [];
      setAdverts([...initialAdverts, ...userAds]);
    } catch (err) {
      console.log("⚠️ load adverts error:", err);
      setAdverts(initialAdverts);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAdverts();
    }, [])
  );

  const deleteAdvert = async (id: string) => {
    Alert.alert("Delete Advertisement", "Are you sure you want to delete it?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = adverts.filter((a) => a.id !== id);
          setAdverts(updated);
          await AsyncStorage.setItem("wisentmatch_adverts", JSON.stringify(updated));
        },
      },
    ]);
  };

  const filtered = adverts.filter((adv) =>
    filter === "all" ? true : adv.type === filter
  );

  const offers = adverts.filter((a) => a.type === "offer").length;
  const requests = adverts.filter((a) => a.type === "request").length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>📢 Marketplace</Text>
            <Text style={styles.subtitle}>
              {filtered.length} advertisement
              {filtered.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Pressable
            style={styles.addBtn}
            onPress={() => router.push("/add-advert")}
          >
            <Text style={styles.addBtnText}>➕ Add Advertisement</Text>
          </Pressable>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabRow}>
          <Pressable
            onPress={() => setFilter("all")}
            style={[styles.tabBtn, filter === "all" && styles.tabActive]}
          >
            <Text
              style={[styles.tabText, filter === "all" && styles.tabTextActive]}
            >
              All ({adverts.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter("offer")}
            style={[styles.tabBtn, filter === "offer" && styles.tabActive]}
          >
            <Text
              style={[styles.tabText, filter === "offer" && styles.tabTextActive]}
            >
              💰 Offers ({offers})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter("request")}
            style={[styles.tabBtn, filter === "request" && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                filter === "request" && styles.tabTextActive,
              ]}
            >
              🔍 Requests ({requests})
            </Text>
          </Pressable>
        </View>

        {/* Listings */}
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📢</Text>
            <Text style={styles.emptyTitle}>No advertisements</Text>
            <Text style={styles.emptyText}>
              Add your first advertisement to the marketplace
            </Text>
            <Pressable style={styles.addBtn} onPress={() => router.push("/add-advert")}>
              <Text style={styles.addBtnText}>➕ Add Advertisement</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {filtered.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    borderLeftColor:
                      item.type === "offer" ? "#16a34a" : "#3b82f6",
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.rowCenter}>
                      <Text style={styles.emoji}>
                        {item.type === "offer" ? "💰" : "🔍"}
                      </Text>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor:
                              item.type === "offer" ? "#dcfce7" : "#dbeafe",
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "700",
                            color:
                              item.type === "offer" ? "#15803d" : "#1d4ed8",
                          }}
                        >
                          {item.type === "offer" ? "Offer" : "Request"}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.desc}>{item.description}</Text>

                    <View style={styles.tagRow}>
                      {item.region && (
                        <Text style={styles.tag}>📍 {item.region}</Text>
                      )}
                      {item.behavior && (
                        <Text style={styles.tag}>🧬 {item.behavior}</Text>
                      )}
                    </View>

                    <View style={styles.metaRow}>
                      <Text style={styles.meta}>👤 {item.breeder}</Text>
                      <Text style={styles.meta}>📅 {item.postedAt}</Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => deleteAdvert(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#111" },
  subtitle: { color: "#666" },
  addBtn: {
    backgroundColor: "#15803d",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addBtnText: { color: "white", fontWeight: "700", fontSize: 13 },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#15803d" },
  tabText: { fontWeight: "600", color: "#444" },
  tabTextActive: { color: "white" },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1.5,
    borderLeftWidth: 6,
    padding: 14,
    borderColor: "#e5e7eb",
  },
  rowCenter: { flexDirection: "row", alignItems: "center", gap: 6 },
  emoji: { fontSize: 22 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start" },
  cardTitle: { fontSize: 18, fontWeight: "700", flexShrink: 1 },
  desc: { marginTop: 6, color: "#374151", fontSize: 13 },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 6,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
  },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  meta: { fontSize: 11, color: "#6b7280" },
  deleteBtn: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  deleteText: { color: "#b91c1c", fontWeight: "700", fontSize: 12 },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: { fontSize: 54, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  emptyText: { color: "#666", marginBottom: 16, textAlign: "center" },
});