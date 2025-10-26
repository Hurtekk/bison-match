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
  image: any;
  flock?: string;
  quarantine?: boolean;
};

// --- Data ---
const regions = [
  "Wielkopolska",
  "Podlasie",
  "Białowieża Forest",
  "Knyszyn Forest",
  "Borecka Forest",
  "Bieszczady",
  "Western Pomerania",
  "Near Gdańsk",
  "Lower Silesia",
  "Near Bałtów",
  "Augustów Forest",
  "Western Pomeranian Forests",
];

const behaviors = [
  "calm",
  "passive",
  "playful",
  "aggressive",
  "very aggressive",
  "territorial",
  "curious",
  "lazy",
  "alert",
  "social",
  "dominant",
  "careful",
  "energetic",
  "loner",
  "cautious",
  "watchful",
];

const healths = ["healthy", "injured"];

// --- Images ---
const images = [
  require("./assets/1.jpg"),
  require("./assets/2.jpg"),
  require("./assets/3.jpg"),
  require("./assets/4.jpg"),
  require("./assets/5.jpg"),
  require("./assets/6.jpg"),
  require("./assets/7.jpg"),
  require("./assets/8.jpg"),
  require("./assets/9.jpg"),
  require("./assets/10.jpg"),
  require("./assets/11.jpg"),
  require("./assets/12.jpg"),
  require("./assets/13.jpg"),
  require("./assets/14.jpg"),
  require("./assets/15.jpg"),
  require("./assets/16.jpg"),
  require("./assets/17.jpg"),
  require("./assets/18.jpg"),
  require("./assets/19.jpg"),
  require("./assets/20.jpg"),
  require("./assets/21.jpg"),
  require("./assets/22.jpg"),
  require("./assets/23.jpg"),
  require("./assets/24.jpg"),
  require("./assets/25.jpg"),
  require("./assets/26.jpg"),
  require("./assets/27.jpg"),
  require("./assets/28.jpg"),
  require("./assets/29.jpg"),
  require("./assets/30.jpg"),
];

// --- Create 30 Bisons ---
const initialBisons: Bison[] = [
  { id: "1", name: "Pola", age: 14, sex: "female", behavior: "passive", region: "Wielkopolska", furLength: "light", healthCondition: "healthy", image: images[0] },
  { id: "2", name: "Polina", age: 8, sex: "female", behavior: "passive", region: "Podlasie", furLength: "dark", healthCondition: "healthy", image: images[1] },
  { id: "3", name: "Polek", age: 12, sex: "male", behavior: "territorial", region: "Podlasie", furLength: "light", healthCondition: "healthy", image: images[2] },
  { id: "4", name: "Polikarp", age: 15, sex: "male", behavior: "passive", region: "Podlasie", furLength: "dark", healthCondition: "healthy", image: images[3] },
  { id: "5", name: "Pomian", age: 13, sex: "male", behavior: "aggressive", region: "Western Pomerania", furLength: "dark", healthCondition: "healthy", image: images[4] },
  { id: "6", name: "Pompejusz", age: 22, sex: "male", behavior: "aggressive", region: "Borecka Forest", furLength: "light", healthCondition: "healthy", image: images[5] },
  { id: "7", name: "Polańka", age: 16, sex: "female", behavior: "passive", region: "Bieszczady", furLength: "dark", healthCondition: "healthy", image: images[6] },
  { id: "8", name: "Polidora", age: 22, sex: "female", behavior: "passive", region: "Near Gdańsk", furLength: "dark", healthCondition: "healthy", image: images[7] },
  { id: "9", name: "Porfir", age: 8, sex: "male", behavior: "territorial", region: "Bieszczady", furLength: "light", healthCondition: "healthy", image: images[8] },
  { id: "10", name: "Polesia", age: 15, sex: "female", behavior: "very aggressive", region: "Białowieża Forest", furLength: "light", healthCondition: "healthy", image: images[9] },
  { id: "11", name: "Polonia", age: 7, sex: "female", behavior: "passive", region: "Bieszczady", furLength: "dark", healthCondition: "healthy", image: images[10] },
  { id: "12", name: "Pompeja", age: 14, sex: "female", behavior: "territorial", region: "Białowieża Forest", furLength: "dark", healthCondition: "healthy", image: images[11] },
  { id: "13", name: "Polan", age: 10, sex: "male", behavior: "passive", region: "Lower Silesia", furLength: "saturated", healthCondition: "healthy", image: images[12] },
  { id: "14", name: "Polinka", age: 24, sex: "female", behavior: "aggressive", region: "Bieszczady", furLength: "dark", healthCondition: "healthy", image: images[13] },
  { id: "15", name: "Polykarp", age: 15, sex: "male", behavior: "territorial", region: "Near Bałtów", furLength: "medium", healthCondition: "healthy", image: images[14] },
  { id: "16", name: "Polaś", age: 13, sex: "male", behavior: "calm", region: "Białowieża Forest", furLength: "medium", healthCondition: "healthy", image: images[15] },
  { id: "17", name: "Polana", age: 10, sex: "female", behavior: "alert", region: "Bieszczady", furLength: "light", healthCondition: "healthy", image: images[16] },
  { id: "18", name: "Poncjusz", age: 15, sex: "male", behavior: "active", region: "Knyszyn Forest", furLength: "medium", healthCondition: "healthy", image: images[17] },
  { id: "19", name: "Polidora", age: 9, sex: "female", behavior: "very calm", region: "Augustów Forest", furLength: "light", healthCondition: "healthy", image: images[18] },
  { id: "20", name: "Polmir", age: 11, sex: "male", behavior: "curious", region: "Western Pomeranian Forests", furLength: "thick", healthCondition: "healthy", image: images[19] },
  { id: "21", name: "Polenus", age: 7, sex: "male", behavior: "lazy", region: "Borecka Forest", furLength: "dark", healthCondition: "healthy", image: images[20] },
  { id: "22", name: "Polidar", age: 12, sex: "male", behavior: "dominant", region: "Białowieża Forest", furLength: "dark", healthCondition: "healthy", image: images[21] },
  { id: "23", name: "Polena", age: 9, sex: "female", behavior: "calm", region: "Bieszczady", furLength: "light", healthCondition: "healthy", image: images[22] },
  { id: "24", name: "Polonia", age: 14, sex: "female", behavior: "cautious", region: "Augustów Forest", furLength: "dark", healthCondition: "healthy", image: images[23] },
  { id: "25", name: "Polybiusz", age: 10, sex: "male", behavior: "energetic", region: "Knyszyn Forest", furLength: "dark", healthCondition: "healthy", image: images[24] },
  { id: "26", name: "Poloniusz", age: 14, sex: "male", behavior: "likes open spaces", region: "Borecka Forest", furLength: "medium", healthCondition: "healthy", image: images[25] },
  { id: "27", name: "Polidor", age: 7, sex: "male", behavior: "watchful", region: "Near Bieszczady", furLength: "dark", healthCondition: "healthy", image: images[26] },
  { id: "28", name: "Poletta", age: 13, sex: "female", behavior: "social", region: "Western Pomeranian Forests", furLength: "medium", healthCondition: "healthy", image: images[27] },
  { id: "29", name: "Poliana", age: 6, sex: "female", behavior: "likes wetlands", region: "Białowieża Forest", furLength: "thin", healthCondition: "healthy", image: images[28] },
  { id: "30", name: "Polonus", age: 11, sex: "male", behavior: "loner", region: "Augustów Forest", furLength: "thick", healthCondition: "healthy", image: images[29] },
];

function matchScore(b: Bison, traits: any): number {
  if (b.quarantine || b.flock) return 0;
  let score = 0;
  if (!traits.region || traits.region === b.region) score += 30;
  if (!traits.behavior || traits.behavior === b.behavior) score += 20;
  if (!traits.health || traits.health === b.healthCondition) score += 20;
  return score;
}

type Advert = {
  id: string;
  type: "offer" | "request";
  title: string;
  description: string;
  breeder: string;
  region?: string;
  behavior?: string;
  postedAt: string;
};

const initialAdverts: Advert[] = [
  {
    id: "adv1",
    type: "offer",
    title: "High-quality hay for winter",
    description: "Freshly cut hay bales. Available in bulk for breeders.",
    breeder: "Green Pastures Farm",
    region: "Białowieża Forest",
    postedAt: "2025-09-01",
  },
  {
    id: "adv2",
    type: "request",
    title: "calm female wisent",
    description: "Preferably 3–5 years old, good health, from Podlasie region.",
    breeder: "Jan Kowalski",
    region: "Podlasie",
    behavior: "calm",
    postedAt: "2025-09-08",
  },
  {
    id: "adv3",
    type: "offer",
    title: "Wisent feeding troughs",
    description: "Strong wooden troughs, suitable for outdoor herds.",
    breeder: "WildCare Supplies",
    postedAt: "2025-09-10",
  },
];

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
    | "adverts"
    | "createAdvert"
  >("login");

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [bisonList, setBisonList] = useState(initialBisons);
  const [selectedBison, setSelectedBison] = useState<Bison | null>(null);

  const [newBison, setNewBison] = useState<any>({});
  const [adverts, setAdverts] = useState(initialAdverts);
  const [newAdvert, setNewAdvert] = useState<any>({});

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

  // Save Advert
  const saveAdvert = () => {
    if (!newAdvert.title || !newAdvert.description || !newAdvert.breeder) {
      Alert.alert("Error", "Title, description, and breeder required");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const adv: Advert = {
      id: Date.now().toString(),
      type: newAdvert.type || "offer",
      title: newAdvert.title,
      description: newAdvert.description,
      breeder: newAdvert.breeder,
      region: newAdvert.region || undefined,
      behavior: newAdvert.behavior || undefined,
      postedAt: today,
    };
    setAdverts([adv, ...adverts]);
    setNewAdvert({});
    setScreen("adverts");
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
        <Image
          source={require("./assets/logo.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>🦬 WisentMatch</Text>
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
            {loggedIn && <TouchableOpacity style={styles.button} onPress={() => setScreen("addBison")}><Text style={styles.btnText}>Add Wisent</Text></TouchableOpacity>}
            {loggedIn && <TouchableOpacity style={styles.button} onPress={() => setScreen("createFlock")}><Text style={styles.btnText}>Add Flock</Text></TouchableOpacity>}
            <TouchableOpacity style={styles.button} onPress={() => setScreen("flocks")}><Text style={styles.btnText}>Flocks</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setScreen("stats")}><Text style={styles.btnText}>Stats</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setScreen("adverts")}>
              <Text style={styles.btnText}>Adverts</Text>
            </TouchableOpacity>
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
                <Image source={item.image} style={styles.img} />
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
          {/* Profile Image */}
          <Image source={selectedBison.image} style={styles.profileImg} />

          {/* Name & Age */}
          <Text style={styles.profileName}>{selectedBison.name}</Text>
          <Text style={styles.profileAge}>{selectedBison.age} years old</Text>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Region</Text>
              <Text style={styles.infoValue}>{selectedBison.region}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>⚧ Sex</Text>
              <Text style={styles.infoValue}>
                {selectedBison.sex.charAt(0).toUpperCase() + selectedBison.sex.slice(1)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🧬 Behavior</Text>
              <Text style={styles.infoValue}>{selectedBison.behavior}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>💚 Health</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: selectedBison.healthCondition === "healthy" ? "#2e7d32" : "#c62828" },
                ]}
              >
                {selectedBison.healthCondition}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🧥 Fur</Text>
              <Text style={styles.infoValue}>{selectedBison.furLength}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          {loggedIn && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: selectedBison.quarantine ? "#ffa000" : "#f57c00" },
                ]}
                onPress={() => toggleQuarantine(selectedBison.id)}
              >
                <Text style={styles.actionBtnText}>
                  {selectedBison.quarantine ? "Remove Quarantine" : "Set Quarantine"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#c62828" }]}
                onPress={() => deleteBison(selectedBison.id)}
              >
                <Text style={styles.actionBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}

          <Back />
        </ScrollView>
      )}

      {/* ADD BISON */}
      {screen === "addBison" && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Add wisent</Text>
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
          <Text style={styles.title}>🐂 Saved Flocks</Text>
          {flocks.length === 0 && <Text>No flocks yet</Text>}
          {flocks.map((f, i) => (
            <View key={i} style={styles.flockCard}>
              {/* Flock Header */}
              <Text style={styles.flockTitle}>{f.name}</Text>

              {/* Traits Chips */}
              <View style={styles.traitsRow}>
                {f.traits.region && (
                  <View style={styles.traitChip}>
                    <Text style={styles.traitText}>{f.traits.region}</Text>
                  </View>
                )}
                {f.traits.behavior && (
                  <View style={styles.traitChip}>
                    <Text style={styles.traitText}>{f.traits.behavior}</Text>
                  </View>
                )}
                {f.traits.health && (
                  <View style={styles.traitChip}>
                    <Text style={styles.traitText}>{f.traits.health}</Text>
                  </View>
                )}
              </View>

              {/* Members Grid */}
              <View style={styles.membersRow}>
                {f.members.map((m) => (
                  <View key={m.id} style={styles.memberCard}>
                    <Image source={m.image} style={styles.memberImg} />
                    <Text style={styles.memberName}>{m.name}</Text>
                    <Text style={styles.memberInfo}>
                      {m.age} yrs · {m.sex}
                    </Text>
                  </View>
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

      {/* ADVERTS */}
      {screen === "adverts" && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>📢 Adverts</Text>
          {loggedIn && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setScreen("createAdvert")}
            >
              <Text style={styles.btnText}>➕ Post New Advert</Text>
            </TouchableOpacity>
          )}
          {adverts.map((adv) => (
            <View
              key={adv.id}
              style={[
                styles.advertCard,
                {
                  borderLeftColor:
                    adv.type === "offer" ? "#2e7d32" : "#1565c0",
                },
              ]}
            >
              <Text style={styles.advertTitle}>
                {adv.type === "offer" ? "💰 For Sale" : "🔍 Looking For"}{" "}
                {adv.title}
              </Text>
              <Text style={styles.advertDesc}>{adv.description}</Text>

              {/* traits */}
              <View style={styles.traitsRow}>
                {adv.region && (
                  <View style={styles.traitChip}>
                    <Text style={styles.traitText}>{adv.region}</Text>
                  </View>
                )}
                {adv.behavior && (
                  <View style={styles.traitChip}>
                    <Text style={styles.traitText}>{adv.behavior}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.advertBreeder}>
                👤 {adv.breeder} · 📅 {adv.postedAt}
              </Text>
            </View>
          ))}
          <Back />
        </ScrollView>
      )}

      {/* CREATE ADVERT */}
      {screen === "createAdvert" && loggedIn && (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>📝 Post New Advert</Text>

          {/* Type Selection */}
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>Type</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    newAdvert.type === "offer" ? "#2e7d32" : "#aaa",
                },
              ]}
              onPress={() => setNewAdvert({ ...newAdvert, type: "offer" })}
            >
              <Text style={styles.btnText}>💰 Offer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    newAdvert.type === "request" ? "#1565c0" : "#aaa",
                },
              ]}
              onPress={() => setNewAdvert({ ...newAdvert, type: "request" })}
            >
              <Text style={styles.btnText}>🔍 Request</Text>
            </TouchableOpacity>
          </View>

          {/* Text Inputs */}
          <TextInput
            placeholder="Title"
            value={newAdvert.title}
            onChangeText={(t) =>
              setNewAdvert({ ...newAdvert, title: t })
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={newAdvert.description}
            onChangeText={(t) =>
              setNewAdvert({ ...newAdvert, description: t })
            }
            multiline
            numberOfLines={4}
            style={[styles.input, { minHeight: 80 }]}
          />
          <TextInput
            placeholder="Breeder Name"
            value={newAdvert.breeder}
            onChangeText={(t) =>
              setNewAdvert({ ...newAdvert, breeder: t })
            }
            style={styles.input}
          />

          {/* Region Selection */}
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>
            Region (Optional)
          </Text>
          {regions.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.button,
                {
                  backgroundColor:
                    newAdvert.region === r ? "#00897b" : "#aaa",
                },
              ]}
              onPress={() =>
                setNewAdvert({
                  ...newAdvert,
                  region: newAdvert.region === r ? null : r,
                })
              }
            >
              <Text style={styles.btnText}>{r}</Text>
            </TouchableOpacity>
          ))}

          {/* Behavior Selection */}
          <Text style={{ marginTop: 10, fontWeight: "bold" }}>
            Behavior (Optional)
          </Text>
          {behaviors.map((b) => (
            <TouchableOpacity
              key={b}
              style={[
                styles.button,
                {
                  backgroundColor:
                    newAdvert.behavior === b ? "#00897b" : "#aaa",
                },
              ]}
              onPress={() =>
                setNewAdvert({
                  ...newAdvert,
                  behavior: newAdvert.behavior === b ? null : b,
                })
              }
            >
              <Text style={styles.btnText}>{b}</Text>
            </TouchableOpacity>
          ))}

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.button, { marginTop: 15 }]}
            onPress={saveAdvert}
          >
            <Text style={styles.btnText}>✅ Post Advert</Text>
          </TouchableOpacity>

          <Back />
        </ScrollView>
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    backgroundColor: "#1b5e20",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingTop: 80,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerLogo: {
    width: 40,
    height: 40,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 8,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  img: { width: 70, height: 70, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: "bold", color: "#2e7d32" },
  title: { margin: 6, fontSize: 20, fontWeight: "bold", color: "#2e7d32" },
  button: { backgroundColor: "#2e7d32", padding: 10, borderRadius: 6, margin: 4 },
  btnDanger: {
    backgroundColor: "#c62828",
    padding: 10,
    borderRadius: 6,
    margin: 4,
  },
  btnText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  topRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    borderRadius: 6,
    margin: 5,
    width: "90%",
  },
  center: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  bigImg: { width: 180, height: 180, borderRadius: 90, margin: 10 },
  menu: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 5,
  },
  flockCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    width: "95%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  flockTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#1565c0",
    marginBottom: 8,
    textAlign: "center",
  },
  traitsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  traitChip: {
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    margin: 4,
  },
  traitText: {
    fontSize: 13,
    color: "#00695c",
    fontWeight: "600",
  },
  membersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  memberCard: {
    alignItems: "center",
    margin: 8,
    width: 90,
  },
  memberImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#2e7d32",
  },
  memberInfo: {
    fontSize: 11,
    color: "#555",
    textAlign: "center",
  },
  profileImg: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: "#2e7d32",
  },
  profileName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1b5e20",
  },
  profileAge: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#333",
  },
  infoValue: {
    fontWeight: "500",
    color: "#444",
    textAlign: "right",
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  advertCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    width: "95%",
    elevation: 2,
    borderLeftWidth: 6,
  },
  advertTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  advertDesc: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  advertBreeder: {
    fontSize: 12,
    color: "#555",
    marginTop: 6,
  },
  statCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    width: "90%",
  },
  statCardFull: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    width: "90%",
  },
});