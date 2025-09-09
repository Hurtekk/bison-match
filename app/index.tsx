import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// --- Bison Data ---
type Bison = {
  id: string;
  name: string;
  age: number;
  sex: "male" | "female";
  dna: string;
  behavior: string;
  region: string;
  color: string;
  furLength: string;
  healthCondition: string;
  image: string;
  flock?: string; // which flock this bison belongs to
};

const regions = ["Mazury", "Bieszczady", "Tatry", "Podlasie", "Kaszuby", "Sudety"];
const behaviors = ["calm", "playful", "aggressive"];
const healths = ["healthy", "injured"];
const furs = ["short", "medium", "long"];
const colors = ["brown", "dark brown", "black", "light brown", "grey", "golden brown"];
const images = [
  "https://upload.wikimedia.org/wikipedia/commons/0/0c/Wisent_Bison_bonasus.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3f/Bison_bonasus_in_Bialowieza_forest.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6e/Bison_bonasus_caucasicus.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/1a/Bison_bonasus_in_snow.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2a/Bison_bonasus_02.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/4/4f/Bison_bonasus_in_forest.jpg",
];

const bisons: Bison[] = Array.from({ length: 20 }).map((_, i) => ({
  id: (i + 1).toString(),
  name: `Bison ${i + 1}`,
  age: 3 + (i % 10),
  sex: i % 2 === 0 ? "male" : "female",
  dna: `AGCT-${1000 + i}`,
  behavior: behaviors[i % behaviors.length],
  region: regions[i % regions.length],
  color: colors[i % colors.length],
  furLength: furs[i % furs.length],
  healthCondition: healths[i % healths.length],
  image: images[i % images.length],
}));

// --- Matching Score ---
function dnaSimilarity(dna1: string, dna2: string): number {
  let matches = 0;
  for (let i = 0; i < Math.min(dna1.length, dna2.length); i++) {
    if (dna1[i] === dna2[i]) matches++;
  }
  return (matches / dna1.length) * 30; // up to 30 points
}

function calculateMatchScore(b: Bison, traits: any): number {
  let score = 0;
  if (traits.region && b.region === traits.region) score += 30;
  if (traits.behavior && b.behavior === traits.behavior) score += 20;
  if (traits.health && b.healthCondition === traits.health) score += 20;
  if (traits.dna) score += dnaSimilarity(b.dna, traits.dna);
  return score;
}

// --- Filter Tag Component ---
function FilterTag({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPressIn={() => (scale.value = withSpring(0.9))}
      onPressOut={() => {
        scale.value = withSpring(1);
        onToggle();
      }}
    >
      <Animated.View
        style={[
          styles.tag,
          animatedStyle,
          { backgroundColor: selected ? "#2e7d32" : "#e0e0e0" },
        ]}
      >
        <Text style={{ color: selected ? "#fff" : "#333", fontWeight: "bold" }}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// --- App ---
export default function App() {
  const [screen, setScreen] = useState<
    "list" | "filters" | "flockTraits" | "savedFlocks" | "viewFlock" | "compareFlocks" | "stats"
  >("list");

  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [healthFilter, setHealthFilter] = useState<string | null>(null);
  const [sexFilter, setSexFilter] = useState<string | null>(null);

  const [flockTraits, setFlockTraits] = useState<any>({});
  const [flockName, setFlockName] = useState("");
  const [savedFlocks, setSavedFlocks] = useState<
    { name: string; members: Bison[]; traits: any }[]
  >([]);
  const [viewedFlock, setViewedFlock] = useState<any>(null);
  const [compareSelection, setCompareSelection] = useState<any[]>([]);

  const [bisonList, setBisonList] = useState<Bison[]>(bisons);

  const filteredBisons = bisonList.filter((b) => {
    if (regionFilter && b.region !== regionFilter) return false;
    if (healthFilter && b.healthCondition !== healthFilter) return false;
    if (sexFilter && b.sex !== sexFilter) return false;
    return true;
  });

  // Create flock based on traits
  const createFlock = () => {
    if (!flockName.trim()) return;

    // Score all bisons
    const scored = bisonList
      .map((b) => ({ bison: b, score: calculateMatchScore(b, flockTraits) }))
      .sort((a, b) => b.score - a.score);

    // Pick top 5–6
    const selected = scored.filter((s) => s.score > 0).slice(0, 6);

    if (selected.length > 0) {
      const updated = bisonList.map((b) =>
        selected.find((s) => s.bison.id === b.id)
          ? { ...b, flock: flockName }
          : b
      );
      setBisonList(updated);

      setSavedFlocks([
        ...savedFlocks,
        {
          name: flockName,
          members: selected.map((s) => ({ ...s.bison, matchScore: s.score })),
          traits: flockTraits,
        },
      ]);
      setFlockName("");
      setFlockTraits({});
      setScreen("savedFlocks");
    }
  };

  // Export flock
  const exportFlock = async (flock: any) => {
    try {
      await Share.share({
        message: JSON.stringify(flock, null, 2),
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Stats
  const stats = {
    healthy: bisonList.filter((b) => b.healthCondition === "healthy").length,
    injured: bisonList.filter((b) => b.healthCondition === "injured").length,
    avgAge:
      bisonList.reduce((sum, b) => sum + b.age, 0) / bisonList.length,
    byRegion: regions.map((r) => ({
      region: r,
      count: bisonList.filter((b) => b.region === r).length,
    })),
  };

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Wisent_Bison_bonasus.jpg",
          }}
          style={styles.headerImage}
        />
        <Text style={styles.headerTitle}>Team Poland Bison App</Text>
      </View>

      {/* --- LIST SCREEN --- */}
      {screen === "list" && (
        <>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <TouchableOpacity
              style={[styles.button, { flex: 1, margin: 5 }]}
              onPress={() => setScreen("filters")}
            >
              <Text style={styles.buttonText}>Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { flex: 1, margin: 5 }]}
              onPress={() => setScreen("flockTraits")}
            >
              <Text style={styles.buttonText}>Create Flock</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { flex: 1, margin: 5, backgroundColor: "#1565c0" }]}
              onPress={() => setScreen("savedFlocks")}
            >
              <Text style={styles.buttonText}>Saved Flocks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { flex: 1, margin: 5, backgroundColor: "#6a1b9a" }]}
              onPress={() => setScreen("stats")}
            >
              <Text style={styles.buttonText}>Stats</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredBisons}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sub}>
                    Age: {item.age} • Sex: {item.sex} • Region: {item.region}
                  </Text>
                  <Text style={styles.sub}>
                    Behavior: {item.behavior} | Fur: {item.furLength}
                  </Text>
                  <Text
                    style={{
                      color: item.healthCondition === "healthy" ? "green" : "red",
                    }}
                  >
                    Health: {item.healthCondition}
                  </Text>
                  {item.flock && (
                    <Text style={{ color: "#1565c0", fontWeight: "bold" }}>
                      Flock: {item.flock}
                    </Text>
                  )}
                </View>
              </View>
            )}
          />
        </>
      )}

      {/* --- FLOCK TRAITS SCREEN --- */}
      {screen === "flockTraits" && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Select Flock Traits</Text>

          <Text style={styles.filterTitle}>Region</Text>
          <View style={styles.row}>
            {regions.map((region) => (
              <FilterTag
                key={region}
                label={region}
                selected={flockTraits.region === region}
                onToggle={() =>
                  setFlockTraits({
                    ...flockTraits,
                    region: flockTraits.region === region ? null : region,
                  })
                }
              />
            ))}
          </View>

          <Text style={styles.filterTitle}>Behavior</Text>
          <View style={styles.row}>
            {behaviors.map((b) => (
              <FilterTag
                key={b}
                label={b}
                selected={flockTraits.behavior === b}
                onToggle={() =>
                  setFlockTraits({
                    ...flockTraits,
                    behavior: flockTraits.behavior === b ? null : b,
                  })
                }
              />
            ))}
          </View>

          <Text style={styles.filterTitle}>Health</Text>
          <View style={styles.row}>
            {healths.map((h) => (
              <FilterTag
                key={h}
                label={h}
                selected={flockTraits.health === h}
                onToggle={() =>
                  setFlockTraits({
                    ...flockTraits,
                    health: flockTraits.health === h ? null : h,
                  })
                }
              />
            ))}
          </View>

          <TextInput
            placeholder="Enter flock name"
            value={flockName}
            onChangeText={setFlockName}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={createFlock}>
            <Text style={styles.buttonText}>Create Flock</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#c62828" }]}
            onPress={() => setScreen("list")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* --- SAVED FLOCKS SCREEN --- */}
      {screen === "savedFlocks" && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Saved Flocks</Text>
          {savedFlocks.length > 0 ? (
            savedFlocks.map((f, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.matchCard}
                onPress={() => {
                  setViewedFlock(f);
                  setScreen("viewFlock");
                }}
                onLongPress={() => {
                  if (compareSelection.find((c) => c.name === f.name)) {
                    setCompareSelection(compareSelection.filter((c) => c.name !== f.name));
                  } else {
                    setCompareSelection([...compareSelection, f]);
                  }
                }}
              >
                <Text style={styles.name}>{f.name}</Text>
                <Text>Members: {f.members.length}</Text>
                <Text>
                  Traits: {f.traits.region || "-"} | {f.traits.behavior || "-"} |{" "}
                  {f.traits.health || "-"}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No flocks saved yet</Text>
          )}
          {compareSelection.length === 2 && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#6a1b9a" }]}
              onPress={() => setScreen("compareFlocks")}
            >
              <Text style={styles.buttonText}>Compare Selected Flocks</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScreen("list")}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* --- VIEW FLOCK SCREEN --- */}
      {screen === "viewFlock" && viewedFlock && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>{viewedFlock.name}</Text>
          <Text>
            Traits: {viewedFlock.traits.region || "-"} |{" "}
            {viewedFlock.traits.behavior || "-"} |{" "}
            {viewedFlock.traits.health || "-"}
          </Text>
          {viewedFlock.members.map((m: any) => (
            <View key={m.id} style={styles.matchCard}>
              <Image source={{ uri: m.image }} style={styles.cardImage} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.name}>{m.name}</Text>
                <Text>Region: {m.region}</Text>
                <Text>Behavior: {m.behavior}</Text>
                <Text>Health: {m.healthCondition}</Text>
                <Text style={{ color: "#1565c0" }}>
                  Match Score: {Math.round(m.matchScore)}%
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#1565c0" }]}
            onPress={() => exportFlock(viewedFlock)}
          >
            <Text style={styles.buttonText}>Export Flock</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScreen("savedFlocks")}
          >
            <Text style={styles.buttonText}>Back to Saved Flocks</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* --- COMPARE FLOCKS SCREEN --- */}
      {screen === "compareFlocks" && compareSelection.length === 2 && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Compare Flocks</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
            {compareSelection.map((f) => (
              <View key={f.name} style={{ flex: 1, margin: 5 }}>
                <Text style={styles.name}>{f.name}</Text>
                <Text>Members: {f.members.length}</Text>
                <Text>
                  Traits: {f.traits.region || "-"} | {f.traits.behavior || "-"} |{" "}
                  {f.traits.health || "-"}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScreen("savedFlocks")}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* --- STATS SCREEN --- */}
      {screen === "stats" && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Bison Statistics</Text>
          <Text>Healthy: {stats.healthy}</Text>
          <Text>Injured: {stats.injured}</Text>
          <Text>Average Age: {stats.avgAge.toFixed(1)}</Text>
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>By Region:</Text>
          {stats.byRegion.map((r) => (
            <Text key={r.region}>
              {r.region}: {r.count}
            </Text>
          ))}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setScreen("list")}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  header: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#2e7d32",
  },
  headerImage: { width: "100%", height: 150, resizeMode: "cover" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  card: {
    flexDirection: "row",
    padding: 15,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: "#2e7d32",
    alignItems: "center",
  },
  cardImage: { width: 80, height: 80, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: "bold", color: "#2e7d32" },
  sub: { fontSize: 14, color: "#555" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2e7d32", marginBottom: 10 },
  button: {
    marginTop: 15,
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    alignSelf: "stretch",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
  center: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  matchCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginVertical: 8,
    width: "90%",
    alignItems: "center",
  },
  tag: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
  },
  row: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  filterTitle: { fontSize: 16, fontWeight: "bold", marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 15,
    width: "90%",
    backgroundColor: "#fff",
  },
});