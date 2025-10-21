import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
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

const initialBisons: Bison[] = [
  {
    id: "1",
    name: "Pola",
    age: 14,
    sex: "female",
    behavior: "passive",
    region: "Wielkopolska",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[0],
  },
  {
    id: "2",
    name: "Polina",
    age: 8,
    sex: "female",
    behavior: "passive",
    region: "Podlasie",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[1],
  },
  {
    id: "3",
    name: "Polek",
    age: 12,
    sex: "male",
    behavior: "territorial",
    region: "Podlasie",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[2],
  },
  {
    id: "4",
    name: "Polikarp",
    age: 15,
    sex: "male",
    behavior: "passive",
    region: "Podlasie",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[3],
  },
  {
    id: "5",
    name: "Pomian",
    age: 13,
    sex: "male",
    behavior: "aggressive",
    region: "Western Pomerania",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[4],
  },
  {
    id: "6",
    name: "Pompejusz",
    age: 22,
    sex: "male",
    behavior: "aggressive",
    region: "Borecka Forest",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[5],
  },
  {
    id: "7",
    name: "Polańka",
    age: 16,
    sex: "female",
    behavior: "passive",
    region: "Bieszczady",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[6],
  },
  {
    id: "8",
    name: "Polidora",
    age: 22,
    sex: "female",
    behavior: "passive",
    region: "Near Gdańsk",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[7],
  },
  {
    id: "9",
    name: "Porfir",
    age: 8,
    sex: "male",
    behavior: "territorial",
    region: "Bieszczady",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[8],
  },
  {
    id: "10",
    name: "Polesia",
    age: 15,
    sex: "female",
    behavior: "very aggressive",
    region: "Białowieża Forest",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[9],
  },
  {
    id: "11",
    name: "Polonia",
    age: 7,
    sex: "female",
    behavior: "passive",
    region: "Bieszczady",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[10],
  },
  {
    id: "12",
    name: "Pompeja",
    age: 14,
    sex: "female",
    behavior: "territorial",
    region: "Białowieża Forest",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[11],
  },
  {
    id: "13",
    name: "Polan",
    age: 10,
    sex: "male",
    behavior: "passive",
    region: "Lower Silesia",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[12],
  },
  {
    id: "14",
    name: "Polinka",
    age: 24,
    sex: "female",
    behavior: "aggressive",
    region: "Bieszczady",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[13],
  },
  {
    id: "15",
    name: "Polykarp",
    age: 15,
    sex: "male",
    behavior: "territorial",
    region: "Near Bałtów",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[14],
  },
  {
    id: "16",
    name: "Polaś",
    age: 13,
    sex: "male",
    behavior: "calm",
    region: "Białowieża Forest",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[15],
  },
  {
    id: "17",
    name: "Polana",
    age: 10,
    sex: "female",
    behavior: "alert",
    region: "Bieszczady",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[16],
  },
  {
    id: "18",
    name: "Poncjusz",
    age: 15,
    sex: "male",
    behavior: "active",
    region: "Knyszyn Forest",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[17],
  },
  {
    id: "19",
    name: "Polidora",
    age: 9,
    sex: "female",
    behavior: "very calm",
    region: "Augustów Forest",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[18],
  },
  {
    id: "20",
    name: "Polmir",
    age: 11,
    sex: "male",
    behavior: "curious",
    region: "Western Pomeranian Forests",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[19],
  },
  {
    id: "21",
    name: "Polenus",
    age: 7,
    sex: "male",
    behavior: "lazy",
    region: "Borecka Forest",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[20],
  },
  {
    id: "22",
    name: "Polidar",
    age: 12,
    sex: "male",
    behavior: "dominant",
    region: "Białowieża Forest",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[21],
  },
  {
    id: "23",
    name: "Polena",
    age: 9,
    sex: "female",
    behavior: "calm",
    region: "Bieszczady",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[22],
  },
  {
    id: "24",
    name: "Polonia",
    age: 14,
    sex: "female",
    behavior: "cautious",
    region: "Augustów Forest",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[23],
  },
  {
    id: "25",
    name: "Polybiusz",
    age: 10,
    sex: "male",
    behavior: "energetic",
    region: "Knyszyn Forest",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[24],
  },
  {
    id: "26",
    name: "Poloniusz",
    age: 14,
    sex: "male",
    behavior: "likes open spaces",
    region: "Borecka Forest",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[25],
  },
  {
    id: "27",
    name: "Polidor",
    age: 7,
    sex: "male",
    behavior: "watchful",
    region: "Near Bieszczady",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[26],
  },
  {
    id: "28",
    name: "Poletta",
    age: 13,
    sex: "female",
    behavior: "social",
    region: "Western Pomeranian Forests",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[27],
  },
  {
    id: "29",
    name: "Poliana",
    age: 6,
    sex: "female",
    behavior: "likes wetlands",
    region: "Białowieża Forest",
    furLength: "normal",
    healthCondition: "healthy",
    image: images[28],
  },
  {
    id: "30",
    name: "Polonus",
    age: 11,
    sex: "male",
    behavior: "loner",
    region: "Augustów Forest",
    furLength: "thick",
    healthCondition: "healthy",
    image: images[29],
  },
];

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
    description:
      "Preferably 3–5 years old, good health, from Podlasie region.",
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

// --- Multi Select ---
const MultiSelectCheckbox = ({
  items,
  selected,
  onSelect,
  maxHeight = 200,
}: {
  items: string[];
  selected: string[];
  onSelect: (items: string[]) => void;
  maxHeight?: number;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleItem = (item: string) => {
    if (selected.includes(item)) {
      onSelect(selected.filter((i) => i !== item));
    } else {
      onSelect([...selected, item]);
    }
  };

  return (
    <View style={styles.multiSelectContainer}>
      <TouchableOpacity
        style={styles.multiSelectButton}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <View style={{ flex: 1 }}>
          {selected.length === 0 ? (
            <Text style={styles.multiSelectButtonText}>Select...</Text>
          ) : (
            <View style={styles.selectedChipsRow}>
              {selected.slice(0, 2).map((item) => (
                <View key={item} style={styles.selectedChip}>
                  <Text style={styles.selectedChipText}>{item}</Text>
                </View>
              ))}
              {selected.length > 2 && (
                <View style={styles.selectedChip}>
                  <Text style={styles.selectedChipText}>
                    +{selected.length - 2}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        <Text style={styles.multiSelectArrow}>
          {showDropdown ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {showDropdown && (
        <BlurView
          intensity={90}
          style={[styles.multiSelectDropdown, { maxHeight }]}
        >
          <ScrollView nestedScrollEnabled>
            {items.map((item) => (
              <View
                key={item}
                style={[
                  styles.multiSelectItem,
                  selected.includes(item) &&
                    styles.multiSelectItemSelected,
                ]}
              >
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => toggleItem(item)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selected.includes(item) && styles.checkboxChecked,
                    ]}
                  >
                    {selected.includes(item) && (
                      <Text style={styles.checkboxCheck}>✓</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.multiSelectItemText,
                      selected.includes(item) &&
                        styles.multiSelectItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </BlurView>
      )}
    </View>
  );
};

// --- Single Select ---
const SingleSelect = ({
  items,
  selected,
  onSelect,
  maxHeight = 150,
}: {
  items: string[];
  selected: string | null;
  onSelect: (item: string | null) => void;
  maxHeight?: number;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.multiSelectContainer}>
      <TouchableOpacity
        style={styles.multiSelectButton}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.multiSelectButtonText}>
          {selected || "Select..."}
        </Text>
        <Text style={styles.multiSelectArrow}>
          {showDropdown ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {showDropdown && (
        <BlurView
          intensity={90}
          style={[styles.multiSelectDropdown, { maxHeight }]}
        >
          <ScrollView nestedScrollEnabled>
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.multiSelectItem,
                  selected === item && styles.multiSelectItemSelected,
                ]}
                onPress={() => {
                  onSelect(selected === item ? null : item);
                  setShowDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.multiSelectItemText,
                    selected === item &&
                      styles.multiSelectItemTextSelected,
                  ]}
                >
                  {selected === item && "✓ "}
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BlurView>
      )}
    </View>
  );
};

// --- Glass Button ---
const GlassButton = ({
  title,
  onPress,
  variant = "primary",
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger";
  style?: any;
}) => {
  const bgColor =
    variant === "primary"
      ? "rgba(46, 125, 50, 0.7)"
      : "rgba(198, 40, 40, 0.7)";
  const borderColor =
    variant === "primary"
      ? "rgba(46, 125, 50, 0.8)"
      : "rgba(198, 40, 40, 0.8)";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.glassButton,
        { backgroundColor: bgColor, borderColor },
        style,
      ]}
    >
      <Text style={styles.glassButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// --- Main App ---
export default function App() {
  const [screen, setScreen] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [bisonList, setBisonList] = useState(initialBisons);
  const [selectedBison, setSelectedBison] = useState<Bison | null>(null);
  const [newBison, setNewBison] = useState<any>({});
  const [adverts, setAdverts] = useState(initialAdverts);
  const [newAdvert, setNewAdvert] = useState<any>({});

  const [regionFilter, setRegionFilter] = useState<string[]>([]);
  const [healthFilter, setHealthFilter] = useState<string[]>([]);
  const [behaviorFilter, setBehaviorFilter] = useState<string[]>([]);

  const [flockName, setFlockName] = useState("");
  const [flockTraits, setFlockTraits] = useState<any>({});
  const [flocks, setFlocks] = useState<
    { name: string; traits: any; members: Bison[] }[]
  >([]);

  const filtered = bisonList.filter((b) => {
    if (regionFilter.length > 0 && !regionFilter.includes(b.region))
      return false;
    if (healthFilter.length > 0 && !healthFilter.includes(b.healthCondition))
      return false;
    if (behaviorFilter.length > 0 && !behaviorFilter.includes(b.behavior))
      return false;
    return true;
  });

  const doLogin = () => {
    if (user === "admin" && pass === "1234") {
      setLoggedIn(true);
      setScreen("list");
    } else {
      Alert.alert("Login failed", "Use admin / 1234");
    }
  };

  const toggleQuarantine = (id: string) => {
    setBisonList(
      bisonList.map((b) =>
        b.id === id ? { ...b, quarantine: !b.quarantine } : b
      )
    );
  };

  const deleteBison = (id: string) => {
    setBisonList(bisonList.filter((b) => b.id !== id));
    setSelectedBison(null);
  };

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
      furLength: newBison.furLength || "normal",
      healthCondition: newBison.healthCondition || "healthy",
      image: images[Math.floor(Math.random() * images.length)],
    };
    setBisonList([b, ...bisonList]);
    setNewBison({});
    setScreen("list");
  };

  const saveFlock = () => {
    if (!flockName.trim()) {
      Alert.alert("Error", "Name required");
      return;
    }
    const candidates = bisonList.filter((b) => !b.flock && !b.quarantine);
    const scored = candidates
      .map((b) => {
        let score = 0;
        if (flockTraits.regions?.length === 0 || flockTraits.regions?.includes(b.region))
          score += 30;
        if (flockTraits.behaviors?.length === 0 || flockTraits.behaviors?.includes(b.behavior))
          score += 20;
        if (flockTraits.healths?.length === 0 || flockTraits.healths?.includes(b.healthCondition))
          score += 20;
        return { b, score };
      })
      .sort((a, b) => b.score - a.score);
    const chosen = scored.slice(0, 6).map((v) => v.b);
    if (chosen.length < 5) {
      Alert.alert("Not enough", "Need 5–6 members");
      return;
    }
    setBisonList(
      bisonList.map((b) =>
        chosen.find((c) => c.id === b.id) ? { ...b, flock: flockName } : b
      )
    );
    setFlocks([
      { name: flockName, traits: flockTraits, members: chosen },
      ...flocks,
    ]);
    setFlockName("");
    setFlockTraits({});
    setScreen("flocks");
  };

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

  const clearFilters = () => {
    setRegionFilter([]);
    setHealthFilter([]);
    setBehaviorFilter([]);
  };

  const stats = {
    healthy: bisonList.filter((b) => b.healthCondition === "healthy").length,
    injured: bisonList.filter((b) => b.healthCondition === "injured").length,
    quarantined: bisonList.filter((b) => b.quarantine).length,
    avgAge: (bisonList.reduce((sum, b) => sum + b.age, 0) / bisonList.length).toFixed(1),
    byRegion: regions.map((r) => ({
      region: r,
      count: bisonList.filter((b) => b.region === r).length,
    })),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BlurView intensity={95} style={styles.headerBlur}>
          <Image
            source={require("./assets/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>🦬 WisentMatch</Text>
        </BlurView>
      </View>

      {screen === "login" ? (
        <View style={styles.center}>
          <BlurView intensity={90} style={styles.loginCard}>
            <Text style={styles.title}>Welcome</Text>
            <TextInput
              value={user}
              onChangeText={setUser}
              placeholder="Username"
              style={styles.glassInput}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <TextInput
              value={pass}
              onChangeText={setPass}
              placeholder="Password"
              secureTextEntry
              style={styles.glassInput}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <GlassButton title="Sign In" onPress={doLogin} />
          </BlurView>
        </View>
      ) : screen === "list" ? (
        <>
          <View style={styles.navigationBar}>
            <TouchableOpacity style={styles.navItem} onPress={() => setScreen("filters")}>
              <Text style={styles.navItemText}>🔍</Text>
              <Text style={styles.navItemLabel}>Filter</Text>
            </TouchableOpacity>
            {loggedIn && (
              <TouchableOpacity style={styles.navItem} onPress={() => setScreen("addBison")}>
                <Text style={styles.navItemText}>➕</Text>
                <Text style={styles.navItemLabel}>Add</Text>
              </TouchableOpacity>
            )}
            {loggedIn && (
              <TouchableOpacity style={styles.navItem} onPress={() => setScreen("createFlock")}>
                <Text style={styles.navItemText}>👥</Text>
                <Text style={styles.navItemLabel}>Flock</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.navItem} onPress={() => setScreen("flocks")}>
              <Text style={styles.navItemText}>🐂</Text>
              <Text style={styles.navItemLabel}>Herds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setScreen("stats")}>
              <Text style={styles.navItemText}>📊</Text>
              <Text style={styles.navItemLabel}>Stats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setScreen("adverts")}>
              <Text style={styles.navItemText}>📢</Text>
              <Text style={styles.navItemLabel}>Posts</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.glassCard}
                onPress={() => {
                  setSelectedBison(item);
                  setScreen("bison");
                }}
              >
                <BlurView intensity={85}>
                  <View style={styles.cardContent}>
                    <Image source={item.image} style={styles.cardImg} />
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{item.name}</Text>
                      <Text style={styles.cardMeta}>
                        {item.age} yrs • {item.region}
                      </Text>
                      <View style={styles.statusRow}>
                        {item.quarantine && (
                          <View style={styles.quarantineBadge}>
                            <Text style={styles.badgeText}>🚫</Text>
                          </View>
                        )}
                        <View
                          style={[
                            styles.healthBadge,
                            {
                              backgroundColor:
                                item.healthCondition === "healthy"
                                  ? "rgba(46, 125, 50, 0.3)"
                                  : "rgba(198, 40, 40, 0.3)",
                            },
                          ]}
                        >
                          <Text style={styles.badgeText}>
                            {item.healthCondition === "healthy" ? "✓" : "!"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        </>
      ) : screen === "bison" && selectedBison ? (
        <ScrollView contentContainerStyle={styles.center}>
          <Image source={selectedBison.image} style={styles.profileImg} />
          <Text style={styles.title}>{selectedBison.name}</Text>
          <Text style={styles.subtitle}>{selectedBison.age} years old</Text>

          <BlurView intensity={90} style={styles.infoPanel}>
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>📍 Region</Text>
              <Text style={styles.infoValue}>{selectedBison.region}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>⚧ Sex</Text>
              <Text style={styles.infoValue}>
                {selectedBison.sex.charAt(0).toUpperCase() +
                  selectedBison.sex.slice(1)}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>🧬 Behavior</Text>
              <Text style={styles.infoValue}>{selectedBison.behavior}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>💚 Health</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color:
                      selectedBison.healthCondition === "healthy"
                        ? "#2e7d32"
                        : "#c62828",
                  },
                ]}
              >
                {selectedBison.healthCondition}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>🧥 Fur</Text>
              <Text style={styles.infoValue}>{selectedBison.furLength}</Text>
            </View>
          </BlurView>

          {loggedIn && (
            <View style={styles.actionRow}>
              <GlassButton
                title={selectedBison.quarantine ? "Remove Quarantine" : "Set Quarantine"}
                onPress={() => toggleQuarantine(selectedBison.id)}
              />
              <GlassButton
                title="Delete"
                onPress={() => deleteBison(selectedBison.id)}
                variant="danger"
              />
            </View>
          )}

          <GlassButton
            title="⬅ Back"
            onPress={() => setScreen("list")}
            style={{ marginTop: 10 }}
          />
        </ScrollView>
      ) : screen === "filters" ? (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Filters</Text>

          <BlurView intensity={90} style={styles.filterPanel}>
            <Text style={styles.formLabel}>Region</Text>
            <MultiSelectCheckbox
              items={regions}
              selected={regionFilter}
              onSelect={setRegionFilter}
              maxHeight={200}
            />

            <Text style={styles.formLabel}>Behavior</Text>
            <MultiSelectCheckbox
              items={behaviors}
              selected={behaviorFilter}
              onSelect={setBehaviorFilter}
              maxHeight={200}
            />

            <Text style={styles.formLabel}>Health</Text>
            <MultiSelectCheckbox
              items={healths}
              selected={healthFilter}
              onSelect={setHealthFilter}
            />

            <GlassButton
              title="🔄 Clear All Filters"
              onPress={clearFilters}
              variant="danger"
              style={{ marginTop: 16 }}
            />
          </BlurView>

          <GlassButton title="⬅ Back" onPress={() => setScreen("list")} style={{ marginTop: 10 }} />
        </ScrollView>
      ) : screen === "addBison" ? (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Add Wisent</Text>

          <BlurView intensity={90} style={styles.formPanel}>
            <TextInput
              placeholder="Name"
              value={newBison.name}
              onChangeText={(t) => setNewBison({ ...newBison, name: t })}
              style={styles.glassInput}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <TextInput
              placeholder="Age"
              value={newBison.age}
              onChangeText={(t) => setNewBison({ ...newBison, age: t })}
              style={styles.glassInput}
              keyboardType="number-pad"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />

            <Text style={styles.formLabel}>Sex</Text>
            <View style={styles.radioGroup}>
              {["male", "female"].map((sex) => (
                <TouchableOpacity
                  key={sex}
                  style={styles.radioOption}
                  onPress={() => setNewBison({ ...newBison, sex })}
                >
                  <View
                    style={[
                      styles.radio,
                      newBison.sex === sex && styles.radioSelected,
                    ]}
                  >
                    {newBison.sex === sex && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>
                    {sex.charAt(0).toUpperCase() + sex.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>Behavior</Text>
            <SingleSelect
              items={behaviors}
              selected={newBison.behavior}
              onSelect={(v) => setNewBison({ ...newBison, behavior: v })}
            />

            <Text style={styles.formLabel}>Region</Text>
            <SingleSelect
              items={regions}
              selected={newBison.region}
              onSelect={(v) => setNewBison({ ...newBison, region: v })}
            />

            <Text style={styles.formLabel}>Fur Length</Text>
            <View style={styles.radioGroup}>
              {["normal", "thick"].map((fur) => (
                <TouchableOpacity
                  key={fur}
                  style={styles.radioOption}
                  onPress={() => setNewBison({ ...newBison, furLength: fur })}
                >
                  <View
                    style={[
                      styles.radio,
                      newBison.furLength === fur && styles.radioSelected,
                    ]}
                  >
                    {newBison.furLength === fur && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>
                    {fur.charAt(0).toUpperCase() + fur.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>Health</Text>
            <View style={styles.radioGroup}>
              {["healthy", "injured"].map((health) => (
                <TouchableOpacity
                  key={health}
                  style={styles.radioOption}
                  onPress={() => setNewBison({ ...newBison, healthCondition: health })}
                >
                  <View
                    style={[
                      styles.radio,
                      newBison.healthCondition === health &&
                        styles.radioSelected,
                    ]}
                  >
                    {newBison.healthCondition === health && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>
                    {health.charAt(0).toUpperCase() + health.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </BlurView>

          <GlassButton title="Save Wisent" onPress={saveBison} />
          <GlassButton title="⬅ Back" onPress={() => setScreen("list")} style={{ marginTop: 10 }} />
        </ScrollView>
      ) : screen === "createFlock" ? (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Create Herd</Text>

          <BlurView intensity={90} style={styles.formPanel}>
            <TextInput
              placeholder="Herd Name"
              value={flockName}
              onChangeText={setFlockName}
              style={styles.glassInput}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />

            <Text style={styles.formLabel}>Region</Text>
            <MultiSelectCheckbox
              items={regions}
              selected={flockTraits.regions || []}
              onSelect={(v) => setFlockTraits({ ...flockTraits, regions: v })}
              maxHeight={150}
            />

            <Text style={styles.formLabel}>Behavior</Text>
            <MultiSelectCheckbox
              items={behaviors}
              selected={flockTraits.behaviors || []}
              onSelect={(v) => setFlockTraits({ ...flockTraits, behaviors: v })}
              maxHeight={150}
            />

            <Text style={styles.formLabel}>Health</Text>
            <MultiSelectCheckbox
              items={healths}
              selected={flockTraits.healths || []}
              onSelect={(v) => setFlockTraits({ ...flockTraits, healths: v })}
            />
          </BlurView>

          <GlassButton title="Create Herd" onPress={saveFlock} />
          <GlassButton title="⬅ Back" onPress={() => setScreen("list")} style={{ marginTop: 10 }} />
        </ScrollView>
      ) : screen === "flocks" ? (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>🐂 Herds</Text>

          {flocks.length === 0 ? (
            <Text style={styles.emptyState}>No herds created yet</Text>
          ) : (
            flocks.map((f, i) => (
              <BlurView key={i} intensity={85} style={styles.herdCard}>
                <Text style={styles.herdTitle}>{f.name}</Text>

                <View style={styles.traitRow}>
                  {f.traits.regions?.map((region: string) => (
                    <View key={region} style={styles.traitTag}>
                      <Text style={styles.traitTagText}>📍 {region}</Text>
                    </View>
                  ))}
                  {f.traits.behaviors?.map((behavior: string) => (
                    <View key={behavior} style={styles.traitTag}>
                      <Text style={styles.traitTagText}>🧬 {behavior}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.memberGrid}>
                  {f.members.map((m) => (
                    <View key={m.id} style={styles.memberTile}>
                      <Image source={m.image} style={styles.memberImg} />
                      <Text style={styles.memberNameSmall}>{m.name}</Text>
                    </View>
                  ))}
                </View>
              </BlurView>
            ))
          )}

          <GlassButton title="⬅ Back" onPress={() => setScreen("list")} style={{ marginTop: 10 }} />
        </ScrollView>
      ) : screen === "stats" ? (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>📊 Statistics</Text>

          <View style={styles.statsGrid}>
            <BlurView intensity={85} style={styles.statTile}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValue}>{stats.healthy}</Text>
              <Text style={styles.statLabel}>Healthy</Text>
            </BlurView>

            <BlurView intensity={85} style={styles.statTile}>
              <Text style={styles.statEmoji}>❌</Text>
              <Text style={styles.statValue}>{stats.injured}</Text>
              <Text style={styles.statLabel}>Injured</Text>
            </BlurView>

            <BlurView intensity={85} style={styles.statTile}>
              <Text style={styles.statEmoji}>🚫</Text>
              <Text style={styles.statValue}>{stats.quarantined}</Text>
              <Text style={styles.statLabel}>Quarantined</Text>
            </BlurView>

            <BlurView intensity={85} style={styles.statTile}>
              <Text style={styles.statEmoji}>📈</Text>
              <Text style={styles.statValue}>{stats.avgAge}</Text>
              <Text style={styles.statLabel}>Avg Age</Text>
            </BlurView>
          </View>

          <BlurView intensity={90} style={styles.regionStats}>
            <Text style={styles.regionStatsTitle}>By Region</Text>
            {stats.byRegion.map((r) => (
              <View key={r.region} style={styles.regionRow}>
                <Text style={styles.regionName}>{r.region}</Text>
                <View style={styles.regionBar}>
                  <View
                    style={[
                      styles.regionBarFill,
                      { width: `${(r.count / 30) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.regionCount}>{r.count}</Text>
              </View>
            ))}
          </BlurView>

          <GlassButton title="⬅ Back" onPress={() => setScreen("list")} style={{ marginTop: 10 }} />
        </ScrollView>
      ) : screen === "adverts" ? (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>📢 Marketplace</Text>

          {loggedIn && (
            <GlassButton title="➕ Post New" onPress={() => setScreen("createAdvert")} />
          )}

          {adverts.map((adv) => (
            <BlurView
              key={adv.id}
              intensity={85}
              style={[
                styles.advertCard,
                {
                  borderLeftColor: adv.type === "offer" ? "#2e7d32" : "#1565c0",
                },
              ]}
            >
              <View style={styles.advertHeader}>
                <Text style={styles.advertType}>
                  {adv.type === "offer" ? "💰" : "🔍"}
                </Text>
                <Text style={styles.advertTitle}>{adv.title}</Text>
              </View>

              <Text style={styles.advertDesc}>{adv.description}</Text>

              <View style={styles.traitRow}>
                {adv.region && (
                  <View style={styles.traitTag}>
                    <Text style={styles.traitTagText}>{adv.region}</Text>
                  </View>
                )}
                {adv.behavior && (
                  <View style={styles.traitTag}>
                    <Text style={styles.traitTagText}>{adv.behavior}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.advertMeta}>
                {adv.breeder} • {adv.postedAt}
              </Text>
            </BlurView>
          ))}

          <GlassButton title="⬅ Back" onPress={() => setScreen("list")} style={{ marginTop: 10 }} />
        </ScrollView>
      ) : screen === "createAdvert" ? (
        <ScrollView contentContainerStyle={styles.center}>
          <Text style={styles.title}>Post Listing</Text>

          <BlurView intensity={90} style={styles.formPanel}>
            <Text style={styles.formLabel}>Type</Text>
            <View style={styles.radioGroup}>
              {[
                { label: "💰 Offer", value: "offer" },
                { label: "🔍 Request", value: "request" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() => setNewAdvert({ ...newAdvert, type: option.value })}
                >
                  <View
                    style={[
                      styles.radio,
                      newAdvert.type === option.value && styles.radioSelected,
                    ]}
                  >
                    {newAdvert.type === option.value && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Title"
              value={newAdvert.title}
              onChangeText={(t) => setNewAdvert({ ...newAdvert, title: t })}
              style={styles.glassInput}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />

            <TextInput
              placeholder="Description"
              value={newAdvert.description}
              onChangeText={(t) =>
                setNewAdvert({ ...newAdvert, description: t })
              }
              multiline
              numberOfLines={4}
              style={[
                styles.glassInput,
                { minHeight: 80, textAlignVertical: "top" },
              ]}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />

            <TextInput
              placeholder="Your Name"
              value={newAdvert.breeder}
              onChangeText={(t) => setNewAdvert({ ...newAdvert, breeder: t })}
              style={styles.glassInput}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />

            <Text style={styles.formLabel}>Region (Optional)</Text>
            <SingleSelect
              items={regions}
              selected={newAdvert.region}
              onSelect={(v) => setNewAdvert({ ...newAdvert, region: v })}
            />

            <Text style={styles.formLabel}>Behavior (Optional)</Text>
            <SingleSelect
              items={behaviors}
              selected={newAdvert.behavior}
              onSelect={(v) => setNewAdvert({ ...newAdvert, behavior: v })}
            />
          </BlurView>

          <GlassButton title="Post Listing" onPress={saveAdvert} />
          <GlassButton title="⬅ Back" onPress={() => setScreen("list")} style={{ marginTop: 10 }} />
        </ScrollView>
      ) : null}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419" },
  center: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerBlur: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  headerLogo: { width: 40, height: 40, marginRight: 12 },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(46, 125, 50, 0.2)",
  },
  navItemText: { fontSize: 24, marginBottom: 4 },
  navItemLabel: { color: "#fff", fontSize: 11, fontWeight: "600" },
  glassCard: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardContent: {
    flexDirection: "row",
    padding: 12,
  },
  cardImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  cardInfo: { flex: 1, justifyContent: "center" },
  cardName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardMeta: { color: "rgba(255, 255, 255, 0.7)", fontSize: 12 },
  statusRow: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  quarantineBadge: {
    backgroundColor: "rgba(198, 40, 40, 0.4)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(198, 40, 40, 0.6)",
  },
  healthBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(46, 125, 50, 0.6)",
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  listContent: { paddingBottom: 20 },
  formPanel: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  glassInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  formLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  multiSelectContainer: { width: "100%", marginBottom: 12 },
  multiSelectButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  multiSelectButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  multiSelectArrow: { color: "rgba(255, 255, 255, 0.7)", fontSize: 12 },
  multiSelectDropdown: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  multiSelectItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  multiSelectItemSelected: {
    backgroundColor: "rgba(46, 125, 50, 0.3)",
  },
  multiSelectItemText: { color: "#fff", fontSize: 14 },
  multiSelectItemTextSelected: { fontWeight: "600", color: "#4caf50" },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "rgba(46, 125, 50, 0.6)",
    borderColor: "rgba(46, 125, 50, 0.8)",
  },
  checkboxCheck: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  selectedChip: {
    backgroundColor: "rgba(46, 125, 50, 0.4)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(46, 125, 50, 0.6)",
  },
  selectedChipText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  radioGroup: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "rgba(46, 125, 50, 0.8)",
    backgroundColor: "rgba(46, 125, 50, 0.3)",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4caf50",
  },
  radioLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  glassButton: {
    backgroundColor: "rgba(46, 125, 50, 0.7)",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
  },
  glassButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginCard: {
    width: "85%",
    borderRadius: 24,
    padding: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  profileImg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "rgba(46, 125, 50, 0.5)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { color: "rgba(255, 255, 255, 0.7)", fontSize: 14 },
  infoPanel: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  infoSection: { paddingVertical: 8 },
  infoLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 8,
  },
  actionRow: {
    gap: 12,
    marginBottom: 20,
    width: "90%",
  },
  herdCard: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  herdTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  traitRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  traitTag: {
    backgroundColor: "rgba(46, 125, 50, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(46, 125, 50, 0.5)",
  },
  traitTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  memberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  memberTile: {
    alignItems: "center",
    width: 80,
  },
  memberImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "rgba(46, 125, 50, 0.4)",
  },
  memberNameSmall: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
    width: "100%",
  },
  statTile: {
    width: "42%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statEmoji: { fontSize: 28, marginBottom: 8 },
  statValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "600",
  },
  regionStats: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  regionStatsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  regionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  regionName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    width: 120,
  },
  regionBar: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  regionBarFill: {
    height: "100%",
    backgroundColor: "rgba(46, 125, 50, 0.6)",
  },
  regionCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    width: 24,
    textAlign: "right",
  },
  advertCard: {
    width: "90%",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    overflow: "hidden",
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  advertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  advertType: { fontSize: 20, marginRight: 8 },
  advertTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  advertDesc: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    marginBottom: 12,
  },
  advertMeta: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    marginTop: 8,
  },
  emptyState: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    fontStyle: "italic",
    marginTop: 20,
  },
  filterPanel: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});