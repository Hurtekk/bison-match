import { behaviors, Bison, healths, initialBisons, regions } from "@/app/lib/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function DashboardIndex() {
  const [bisons, setBisons] = useState<Bison[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // filtry
  const [regionFilter, setRegionFilter] = useState<string[]>([]);
  const [behaviorFilter, setBehaviorFilter] = useState<string[]>([]);
  const [healthFilter, setHealthFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // ========================
  // LOAD BISON DATA
  // ========================
  const loadBisons = async () => {
    try {
      const stored = await AsyncStorage.getItem("wisentmatch_bisons");
      const userBisons = stored ? JSON.parse(stored) : [];
      // połącz initial + user added
      const merged = [...initialBisons, ...userBisons];
      setBisons(merged);
    } catch (e) {
      console.error("⚠️ Failed to load bisons:", e);
      setBisons(initialBisons);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBisons();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBisons();
    setRefreshing(false);
  };

  // ========================
  // FILTER SYSTEM
  // ========================
  const toggleFilter = (
    arr: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (arr.includes(value)) setter(arr.filter((v) => v !== value));
    else setter([...arr, value]);
  };

  const clearAllFilters = () => {
    setRegionFilter([]);
    setBehaviorFilter([]);
    setHealthFilter([]);
  };

  const filteredBisons = useMemo(() => {
    return bisons.filter((bison) => {
      if (regionFilter.length > 0 && !regionFilter.includes(bison.region))
        return false;
      if (
        healthFilter.length > 0 &&
        !healthFilter.includes(bison.healthCondition)
      )
        return false;
      if (behaviorFilter.length > 0 && !behaviorFilter.includes(bison.behavior))
        return false;
      return true;
    });
  }, [bisons, regionFilter, behaviorFilter, healthFilter]);

  const activeFilterCount =
    regionFilter.length + behaviorFilter.length + healthFilter.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🦬 Wisent Database</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/add-wisent")}
        >
          <Text style={styles.addButtonText}>➕ Add Wisent</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>
        {filteredBisons.length} of {bisons.length} total
      </Text>

      {/* TOGGLE FILTERS */}
      <Pressable
        onPress={() => setShowFilters(!showFilters)}
        style={styles.toggleFiltersBtn}
      >
        <Text style={styles.toggleFiltersText}>
          {showFilters
            ? `Hide Filters (${activeFilterCount})`
            : `Show Filters (${activeFilterCount})`}
        </Text>
      </Pressable>

      {/* FILTERS PANEL */}
      {showFilters && (
        <ScrollView
          contentContainerStyle={styles.filtersContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <FilterGroup
            label="Region"
            items={regions}
            selected={regionFilter}
            onToggle={(v) => toggleFilter(regionFilter, setRegionFilter, v)}
          />
          <FilterGroup
            label="Behavior"
            items={behaviors}
            selected={behaviorFilter}
            onToggle={(v) => toggleFilter(behaviorFilter, setBehaviorFilter, v)}
          />
          <FilterGroup
            label="Health"
            items={healths}
            selected={healthFilter}
            onToggle={(v) => toggleFilter(healthFilter, setHealthFilter, v)}
          />
        </ScrollView>
      )}

      {activeFilterCount > 0 && (
        <Pressable style={styles.clearBtn} onPress={clearAllFilters}>
          <Text style={styles.clearBtnText}>Clear all filters</Text>
        </Pressable>
      )}

      {/* LIST */}
      <FlatList
        data={filteredBisons}
        keyExtractor={(b) => b.id || b.name}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>
              {item.age} yrs • {item.sex}
            </Text>
            <Text style={styles.cardMeta}>{item.region}</Text>
            <Text style={styles.cardBehavior}>{item.behavior}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>😔</Text>
            <Text style={styles.emptyText}>No wisents match filters</Text>
            <Pressable style={styles.addButton} onPress={clearAllFilters}>
              <Text style={styles.addButtonText}>Clear filters</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ========================
// FILTER COMPONENT
// ========================
function FilterGroup({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>
        {label}
        {selected.length > 0 ? ` (${selected.length})` : ""}
      </Text>
      <View style={styles.filterWrap}>
        {items.map((val) => {
          const active = selected.includes(val);
          return (
            <Pressable
              key={val}
              onPress={() => onToggle(val)}
              style={[styles.filterBtn, active && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {val}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ========================
// STYLES
// ========================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  subtitle: {
    color: "#666",
    fontSize: 13,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  filtersContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 10,
  },
  filterGroup: { marginRight: 12 },
  filterLabel: { fontWeight: "700", marginBottom: 6, color: "#333" },
  filterWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  filterBtn: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterBtnActive: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
    borderWidth: 1,
  },
  filterText: { color: "#333", fontSize: 13 },
  filterTextActive: { color: "#166534", fontWeight: "700" },
  toggleFiltersBtn: {
    alignSelf: "center",
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  toggleFiltersText: { color: "#111", fontSize: 13, fontWeight: "600" },
  clearBtn: {
    alignSelf: "flex-start",
    marginLeft: 16,
    backgroundColor: "#fee2e2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  clearBtnText: { color: "#b91c1c", fontWeight: "600" },
  listContent: { paddingHorizontal: 10, paddingBottom: 30 },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    margin: 6,
    padding: 10,
    alignItems: "center",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
    marginBottom: 6,
  },
  cardTitle: { fontWeight: "700", color: "#111", fontSize: 16 },
  cardMeta: { color: "#555", fontSize: 13 },
  cardBehavior: {
    color: "#15803d",
    fontWeight: "600",
    marginTop: 3,
  },
  addButton: {
    backgroundColor: "#15803d",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addButtonText: { color: "white", fontWeight: "700" },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 40 },
  emptyEmoji: { fontSize: 44, marginBottom: 10 },
  emptyText: { color: "#444", marginBottom: 12 },
});