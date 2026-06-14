import {
  FlatList,
  ImageBackground,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { exerciseData } from "../data/dummyData";

const { width } = Dimensions.get("window");
const cardWidth = (width - 40) / 2;

export default function MainMenuScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>CALISTHENICS-ÜBUNGEN</Text>
        <Text style={styles.subtitle}>
          Trainiere mit deinem Körpergewicht überall.
        </Text>
      </View>

      <FlatList
        data={exerciseData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth }]}>
            <ImageBackground
              source={item.image}
              style={styles.cardImage}
              imageStyle={styles.imageRadius}
            >
              <View style={styles.cardOverlay} />
              <View style={styles.iconBadge}>
                <View style={styles.iconDot} />
                <View style={styles.iconBar} />
              </View>
              <View style={styles.cardTitleWrap}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b0b0d",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 16,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: "#c3c3c8",
    fontSize: 14,
    lineHeight: 20,
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#121217",
  },
  cardImage: {
    flex: 1,
    justifyContent: "space-between",
    padding: 14,
  },
  imageRadius: {
    borderRadius: 20,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.32)",
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ff5656",
  },
  iconBar: {
    position: "absolute",
    width: 10,
    height: 2,
    backgroundColor: "#ff5656",
    bottom: 8,
    borderRadius: 1,
  },
  cardTitleWrap: {
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
