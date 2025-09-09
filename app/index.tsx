import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- Types ---
type Bison = {
  id: string;
  name: string;
  age: number;
  sex: "male" | "female";
  behavior: string;
  region: string;
  furLength: string;
  healthCondition: string;
  image: string;
  flock?: string;
  quarantine?: boolean;
};

// --- Data ---
const regions = ["Puszcza Białowieska", "Puszcza Knyszyńska"];
const behaviors = ["calm", "playful", "aggressive"];
const healths = ["healthy", "injured"];
const furs = ["short", "medium", "long"];
const images = [
  "https://upload.wikimedia.org/wikipedia/commons/0/0c/Wisent_Bison_bonasus.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3f/Bison_bonasus_in_Bialowieza_forest.jpg",
];

// --- Create 20 Mock Bisons
const initialBisons: Bison[] = Array.from({ length: 20 }).map((_, i) => ({
  id: (i + 1).toString(),
  name: `Bison ${i + 1}`,
  age: 3 + (i % 10),
  sex: i % 2 === 0 ? "male" : "female",
  behavior: behaviors[i % behaviors.length],
  region: regions[i % regions.length],
  furLength: furs[i % furs.length],
  healthCondition: healths[i % healths.length],
  image: images[i % images.length],
  quarantine: false,
}));

function matchScore(b: Bison, traits: any): number {
  if (b.quarantine || b.flock) return 0;
  let score = 0;
  if (!traits.region || traits.region === b.region) score += 30;
  if (!traits.behavior || traits.behavior === b.behavior) score += 20;
  if (!traits.health || traits.health === b.healthCondition) score += 20;
  return score;
}

// --- App ---
export default function App() {
  const [screen, setScreen] = useState<
    | "login"
    | "list"
    | "bison"
    | "addBison"
    | "filters"
    | "createFlock"
    | "flocks"
    | "stats"
  >("login");

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [bisonList, setBisonList] = useState(initialBisons);
  const [selectedBison, setSelectedBison] = useState<Bison | null>(null);

  const [newBison, setNewBison] = useState<any>({});

  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [healthFilter, setHealthFilter] = useState<string | null>(null);
  const [sexFilter, setSexFilter] = useState<string | null>(null);

  const [flockName, setFlockName] = useState("");
  const [flockTraits, setFlockTraits] = useState<any>({});
  const [flocks, setFlocks] = useState<
    { name: string; traits: any; members: Bison[] }[]
  >([]);

  const filtered = bisonList.filter((b) => {
    if (regionFilter && b.region !== regionFilter) return false;
    if (healthFilter && b.healthCondition !== healthFilter) return false;
    if (sexFilter && b.sex !== sexFilter) return false;
    return true;
  });

  // Login
  const doLogin = () => {
    if (user === "admin" && pass === "1234") {
      setLoggedIn(true);
      setScreen("list");
    } else {
      Alert.alert("Login failed", "Use admin / 1234");
    }
  };

  // Quarantine
  const toggleQuarantine = (id: string) => {
    setBisonList(
      bisonList.map((b) =>
        b.id === id ? { ...b, quarantine: !b.quarantine } : b
      )
    );
    setScreen("list");
  };

  // Delete
  const deleteBison = (id: string) => {
    setBisonList(bisonList.filter((b) => b.id !== id));
    setSelectedBison(null);
    setScreen("list");
  };

  // Add Bison
  const saveBison = () => {
    if (!newBison.name || !newBison.region) {
      Alert.alert("Error", "Name + region required");
      return;
    }
    const b: Bison = {
      id: Date.now().toString(),
      name: newBison.name,
      age: parseInt(newBison.age) || 5,
      sex: newBison.sex || "male",
      behavior: newBison.behavior || "calm",
      region: newBison.region,
      furLength: newBison.furLength || "medium",
      healthCondition: newBison.healthCondition || "healthy",
      image: images[Math.floor(Math.random() * images.length)],
    };
    setBisonList([b, ...bisonList]);
    setNewBison({});
    setScreen("list");
  };

  // Create flock
  const saveFlock = () => {
    if (!flockName.trim()) {
      Alert.alert("Error", "Name required");
      return;
    }
    const candidates = bisonList.filter((b) => !b.flock && !b.quarantine);
    const scored = candidates
      .map((b) => ({ b, score: matchScore(b, flockTraits) }))
      .sort((a, b) => b.score - a.score);
    const chosen = scored.slice(0, 6).map((v) => v.b);
    if (chosen.length < 5) {
      Alert.alert("Not enough", "Need 5–6 members");
      return;
    }
    setBisonList(
      bisonList.map((b) =>
        chosen.find((c) => c.id === b.id)
          ? { ...b, flock: flockName }
          : b
      )
    );
    setFlocks([{ name: flockName, traits: flockTraits, members: chosen }, ...flocks]);
    setFlockName("");
    setFlockTraits({});
    setScreen("flocks");
  };

  // Stats
  const stats = {
    healthy: bisonList.filter((b) => b.healthCondition === "healthy").length,
    injured: bisonList.filter((b) => b.healthCondition === "injured").length,
    quarantined: bisonList.filter((b) => b.quarantine).length,
    avgAge: (
      bisonList.reduce((sum, b) => sum + b.age, 0) / bisonList.length
    ).toFixed(1),
    byRegion: regions.map((r) => ({
      region: r,
      count: bisonList.filter((b) => b.region === r).length,
    })),
  };

  const Back = () => (
    <TouchableOpacity style={styles.btnDanger} onPress={() => setScreen("list")}>
      <Text style={styles.btnText}>⬅ Back</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🦬 BisonMatch</Text>
      </View>

      {/* LOGIN */}
      {screen === "login" && (
        <View style={styles.center}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            value={user}
            onChangeText={setUser}
            placeholder="Username"
            style={styles.input}
          />
          <TextInput
            value={pass}
            onChangeText={setPass}
            placeholder="Password"
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={doLogin}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* LIST */}
      {screen === "list" && (
        <>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.button} onPress={() => setScreen("filters")}><Text style={styles.btnText}>Filters</Text></TouchableOpacity>
            {loggedIn && <TouchableOpacity style={styles.button} onPress={() => setScreen("addBison")}><Text style={styles.btnText}>Add Bison</Text></TouchableOpacity>}
            {loggedIn && <TouchableOpacity style={styles.button} onPress={() => setScreen("createFlock")}><Text style={styles.btnText}>Add Flock</Text></TouchableOpacity>}
            <TouchableOpacity style={styles.button} onPress={() => setScreen("flocks")}><Text style={styles.btnText}>Flocks</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setScreen("stats")}><Text style={styles.btnText}>Stats</Text></TouchableOpacity>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setSelectedBison(item);
                  setScreen("bison");
                }}
              >
                <Image source={{ uri: item.image }} style={styles.img} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text>{item.age} yrs | {item.region}</Text>
                  <Text>Health: {item.healthCondition}</Text>
                  {item.flock && <Text style={{ color: "blue" }}>Flock: {item.flock}</Text>}
                  {item.quarantine && <Text style={{ color: "red" }}>🚫 Quarantine</Text>}
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* BISON PROFILE */}
      {screen === "bison" && selectedBison && (
        <ScrollView contentContainerStyle={styles.center}>
          <Image source={{ uri: selectedBison.image }} style={styles.bigImg} />
          <Text style={styles.title}>{selectedBison.name}</Text>
          <Text>Age: {selectedBison.age}</Text>
          <Text>Sex: {selectedBison.sex}</Text>
          <Text>Region: {selectedBison.region}</Text>
          <Text>Behavior: {selectedBison.behavior}</Text>
          <Text>Health: {selectedBison.healthCondition}</Text>
          {loggedIn && (
            <>
              <TouchableOpacity style={styles.button} onPress={() => toggleQuarantine(selectedBison.id)}>
                <Text style={styles.btnText}>{selectedBison.quarantine ? "Remove Quarantine" : "Set Quarantine"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDanger} onPress={() => deleteBison(selectedBison.id)}>
                <Text style={styles.btnText}>Delete Bison</Text>
              </TouchableOpacity>
            </>
          )}
          <Back />
        </ScrollView>
      )}

      {/* ADD BISON */}
      {screen === "addBison" && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Add Bison</Text>
          {["name", "age", "sex", "behavior", "region", "furLength", "healthCondition"].map((f) => (
            <TextInput key={f} placeholder={f} value={newBison[f]} onChangeText={(t) => setNewBison({ ...newBison, [f]: t })} style={styles.input} />
          ))}
          <TouchableOpacity style={styles.button} onPress={saveBison}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
          <Back />
        </ScrollView>
      )}

      {/* FILTERS */}
      {screen === "filters" && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Filters</Text>
          <Text>Region</Text>
          {regions.map((r) => (
            <TouchableOpacity key={r} style={[styles.button, { backgroundColor: regionFilter === r ? "green" : "grey" }]} onPress={() => setRegionFilter(regionFilter === r ? null : r)}><Text style={styles.btnText}>{r}</Text></TouchableOpacity>
          ))}
          <Text>Sex</Text>
          {["male", "female"].map((s) => (
            <TouchableOpacity key={s} style={[styles.button, { backgroundColor: sexFilter === s ? "green" : "grey" }]} onPress={() => setSexFilter(sexFilter === s ? null : s)}><Text style={styles.btnText}>{s}</Text></TouchableOpacity>
          ))}
          <Text>Health</Text>
          {healths.map((h) => (
            <TouchableOpacity key={h} style={[styles.button, { backgroundColor: healthFilter === h ? "green" : "grey" }]} onPress={() => setHealthFilter(healthFilter === h ? null : h)}><Text style={styles.btnText}>{h}</Text></TouchableOpacity>
          ))}
          <Back />
        </ScrollView>
      )}

      {/* CREATE FLOCK */}
      {screen === "createFlock" && loggedIn && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Create Flock</Text>
          <TextInput placeholder="Flock Name" style={styles.input} value={flockName} onChangeText={setFlockName} />
          <Text>Region</Text>
          {regions.map((r) => (
            <TouchableOpacity key={r} style={[styles.button, { backgroundColor: flockTraits.region === r ? "green" : "grey" }]} onPress={() => setFlockTraits({ ...flockTraits, region: flockTraits.region === r ? null : r })}><Text style={styles.btnText}>{r}</Text></TouchableOpacity>
          ))}
          <Text>Behavior</Text>
          {behaviors.map((b) => (
            <TouchableOpacity key={b} style={[styles.button, { backgroundColor: flockTraits.behavior === b ? "green" : "grey" }]} onPress={() => setFlockTraits({ ...flockTraits, behavior: flockTraits.behavior === b ? null : b })}><Text style={styles.btnText}>{b}</Text></TouchableOpacity>
          ))}
          <Text>Health</Text>
          {healths.map((h) => (
            <TouchableOpacity key={h} style={[styles.button, { backgroundColor: flockTraits.health === h ? "green" : "grey" }]} onPress={() => setFlockTraits({ ...flockTraits, health: flockTraits.health === h ? null : h })}><Text style={styles.btnText}>{h}</Text></TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.button} onPress={saveFlock}><Text style={styles.btnText}>Save Flock</Text></TouchableOpacity>
          <Back />
        </ScrollView>
      )}

      {/* SAVED FLOCKS */}
      {screen === "flocks" && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Saved Flocks</Text>
          {flocks.length === 0 && <Text>No flocks yet</Text>}
          {flocks.map((f, i) => (
            <View key={i} style={styles.flockCard}>
              <Text style={styles.flockTitle}>{f.name}</Text>
              <Text style={styles.flockTraits}>Traits: {f.traits.region} | {f.traits.behavior} | {f.traits.health}</Text>
              <View style={{ marginTop: 5 }}>
                {f.members.map((m) => (
                  <Text key={m.id} style={{ color: "#333" }}>• {m.name} ({m.region})</Text>
                ))}
              </View>
            </View>
          ))}
          <Back />
        </ScrollView>
      )}

      {/* STATS */}
      {screen === "stats" && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>📊 Stats</Text>
          <View style={styles.statCard}><Text>✅ Healthy</Text><Text>{stats.healthy}</Text></View>
          <View style={styles.statCard}><Text>❌ Injured</Text><Text>{stats.injured}</Text></View>
          <View style={styles.statCard}><Text>🚫 Quarantined</Text><Text>{stats.quarantined}</Text></View>
          <View style={styles.statCard}><Text>📈 Avg Age</Text><Text>{stats.avgAge}</Text></View>
          <View style={styles.statCardFull}>
            <Text style={{ fontWeight: "bold" }}>By Region:</Text>
            {stats.byRegion.map((r) => (
              <Text key={r.region}>{r.region}: {r.count}</Text>
            ))}
          </View>
          <Back />
        </ScrollView>
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: { backgroundColor: "#1b5e20", padding: 75, alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  card: { flexDirection: "row", backgroundColor: "#fff", margin: 8, padding: 10, borderRadius: 8, elevation: 2 },
  img: { width: 70, height: 70, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: "bold", color: "#2e7d32" },
  title: { margin: 6, fontSize: 20, fontWeight: "bold", color: "#2e7d32" },
  button: { backgroundColor: "#2e7d32", padding: 10, borderRadius: 6, margin: 4 },
  btnDanger: { backgroundColor: "#c62828", padding: 10, borderRadius: 6, margin: 4 },
  btnText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  topRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#aaa", padding: 8, borderRadius: 6, margin: 5, width: "90%" },
  center: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  bigImg: { width: 180, height: 180, borderRadius: 90, margin: 10 },
  menu: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginVertical: 5 },
  flockCard: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginVertical: 6, width: "95%", elevation: 2 },
  flockTitle: { fontWeight: "bold", fontSize: 18, color: "#1565c0" },
  flockTraits: { color: "#444", fontStyle: "italic" },
  statCard: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", padding: 10, borderRadius: 8, marginVertical: 4, width: "90%" },
  statCardFull: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginVertical: 4, width: "90%" },
});