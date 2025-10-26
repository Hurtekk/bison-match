import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardLayout() {
  const router = useRouter();

  const navigation = [
    { name: "Wisent List", route: "", icon: "🦬" },
    { name: "Herds", route: "herds", icon: "🐂" },
    { name: "Create Herd", route: "create-herd", icon: "👥" },
    { name: "Add Wisent", route: "add-wisent", icon: "➕" },
    { name: "Statistics", route: "stats", icon: "📊" },
    { name: "Marketplace", route: "marketplace", icon: "📢" },
    { name: "Breeding", route: "breeding", icon: "❤️" },
  ];

  const handleLogout = () => router.push("/");

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: "#e6f4ea",
        drawerActiveTintColor: "#15803d",
        drawerType: "slide",
        headerTitle: "WisentMatch",
        headerStyle: { backgroundColor: "white" },
        headerTitleStyle: { fontWeight: "700" },
      }}
      drawerContent={() => (
        <SafeAreaView
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: "white",
          }}
          edges={["top", "left", "right", "bottom"]}
        >
          <View style={styles.logoRow}>
            <Text style={styles.logoIcon}>🦬</Text>
            <Text style={styles.logoText}>WisentMatch</Text>
          </View>

          {navigation.map((item) => (
            <Pressable
              key={item.name}
              onPress={() => router.push(`/${item.route}`)}
              style={({ pressed }) => [
                styles.navItem,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={styles.navText}>{item.name}</Text>
            </Pressable>
          ))}

          <View style={styles.logoutContainer}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.navItem,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.navIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      )}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Dashboard Home",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  logoIcon: { fontSize: 28 },
  logoText: { fontSize: 20, fontWeight: "700" },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  navIcon: { fontSize: 22 },
  navText: { fontSize: 16 },
  logoutContainer: { marginTop: "auto" },
  logoutText: { fontSize: 16, color: "#c0392b" },
});