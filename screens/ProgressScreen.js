import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Fortschritt</Text>
        <Text style={styles.subtitle}>
          Hier siehst du deine Trainingsdaten und Erfolge.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b0b0d",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 12,
  },
  subtitle: {
    color: "#c3c3c8",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});
