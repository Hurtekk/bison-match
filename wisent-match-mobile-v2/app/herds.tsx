import { Bison } from "@/app/lib/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

type Flock = {
  name: string;
  traits: {
    regions?: string[];
    behaviors?: string[];
    healths?: string[];
  };
  members: Bison[];
  createdAt: string;
};

export default function HerdsScreen() {
  const [flocks, setFlocks] = useState<Flock[]>([]);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("wisentmatch_flocks");
      if (saved) {
        try {
          setFlocks(JSON.parse(saved));
        } catch {
          console.warn("Failed to parse stored flocks");
        }
      }
    })();
  }, []);

  const deleteHerd = async (index: number) => {
    Alert.alert(
      "Delete Herd",
      `Are you sure you want to delete "${flocks[index].name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = flocks.filter((_, i) => i !== index);
            setFlocks(updated);
            await AsyncStorage.setItem(
              "wisentmatch_flocks",
              JSON.stringify(updated)
            );
          },
        },
      ]
    );
  };

  const renderFlock = ({ item, index }: { item: Flock; index: number }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDate}>
            Created {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => deleteHerd(index)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>

      {(item.traits.regions?.length ||
        item.traits.behaviors?.length ||
        item.traits.healths?.length) && (
        <View style={styles.traitsContainer}>
          {item.traits.regions?.map((region) => (
            <Text key={region} style={[styles.trait, styles.region]}>
              📍 {region}
            </Text>
          ))}
          {item.traits.behaviors?.map((behavior) => (
            <Text key={behavior} style={[styles.trait, styles.behavior]}>
              🧬 {behavior}
            </Text>
          ))}
          {item.traits.healths?.map((health) => (
            <Text key={health} style={[styles.trait, styles.health]}>
              💚 {health}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.membersTitle}>
        Members ({item.members.length})
      </Text>

      <View style={styles.membersGrid}>
  {item.members.map((member) => (
    <View key={member.id} style={styles.memberCard}>
      <Image source={member.image} style={styles.memberImage} />
      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={styles.memberAge}>{member.age} yrs</Text>
    </View>
  ))}
</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🐂 Herds</Text>
          <Text style={styles.headerSubtitle}>
            {flocks.length} herd{flocks.length !== 1 && "s"} created
          </Text>
        </View>

        {flocks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🐂</Text>
            <Text style={styles.emptyTitle}>No herds yet</Text>
            <Text style={styles.emptyDesc}>
              Create your first herd to get started
            </Text>
            <Link href="/dashboard/create-herd" asChild>
              <Pressable style={styles.createButton}>
                <Text style={styles.createButtonText}>Create Herd</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            {flocks.map((flock, index) => renderFlock({ item: flock, index }))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#111" },
  headerSubtitle: { color: "#666", fontSize: 14 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  cardDate: { fontSize: 13, color: "#666" },
  deleteButton: {
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteText: { color: "#c0392b", fontWeight: "600", fontSize: 13 },
  traitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  trait: {
    fontSize: 13,
    fontWeight: "500",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    overflow: "hidden",
  },
  region: {
    backgroundColor: "#e6f4ea",
    color: "#166534",
  },
  behavior: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
  },
  health: {
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
  },
  membersTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  membersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  memberCard: {
    width: "30%",
    alignItems: "center",
  },
  memberImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    marginBottom: 4,
  },
  memberName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
  },
  memberAge: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  emptyDesc: { color: "#666", marginBottom: 20, textAlign: "center" },
  createButton: {
    backgroundColor: "#15803d",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createButtonText: { color: "white", fontWeight: "600" },
});