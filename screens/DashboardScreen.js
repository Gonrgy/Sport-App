import { useState, useEffect, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { libraryItems } from "../data/exercises";
import { filters } from "../data/exercises";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import {
  delete_table,
  create_table_kategorie,
  create_table,
  read_categories_data_handler,
  read_exercise_entries_data_handler,
} from "../functions/functionsSqLite";
import { alle_tabellen } from "../functions/functionsSqLite";
import { useCategoriesStore } from "../functions/storeData";

export default function DashboardScreen({ navigation }) {
  const db = useSQLiteContext();

  const setCategories = useCategoriesStore((state) => state.setCategories);
  const setExercises = useCategoriesStore((state) => state.setExercises);
  const exercises = useCategoriesStore((state) => state.exercises);

  const [filterName, setFilterName] = useState("All");

  const exercises_use_memo_handler_array = useMemo(() => {
    if (filterName === "All") {
      return libraryItems;
    } else {
      const array = [...libraryItems];
      const filtered = array.filter((el, index, array) => {
        return el.tags.includes(filterName);
      });
      return filtered;
    }
  }, [filterName]);

  useEffect(() => {
    async function fetchData() {
      //await alle_tabellen(db);
      //await delete_table(db);
      await read_categories_data_handler(db, setCategories);
      await read_exercise_entries_data_handler(db, setExercises);
    }
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>DASHBOARD</Text>
        <Text style={styles.title}>My Calisthenics Library</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filterRow}>
          {filters.map((text, index) => (
            <TouchableOpacity
              onPress={() => setFilterName(text)}
              key={index}
              style={styles.filterPill}
              activeOpacity={0.8}
            >
              <Text style={styles.filterText}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.grid}>
          {exercises_use_memo_handler_array.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                navigation.navigate("Modal", {
                  exercise: item.title,
                  subtitle: item.subtitle,
                  image: item.image,
                  tags: item.tags,
                });
              }}
              style={styles.card}
              activeOpacity={0.85}
            >
              <View style={styles.imageWrapper}>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.favoriteMarker}>
                  <Text style={styles.favoriteText}>♥</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                <View style={styles.tagsRow}>
                  {item.tags.map((tag, index) => (
                    <View key={`${tag}-${index}`} style={styles.tagBubble}>
                      <Text style={styles.tagLabel}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 1.8,
    color: "#6c80a4",
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  filterPill: {
    backgroundColor: "#152239",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  filterText: {
    color: "#d7e0f4",
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "100%",
    maxWidth: "48%",
    borderRadius: 24,
    backgroundColor: "#ffffff",
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  favoriteMarker: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteText: {
    color: "#ff6b81",
    fontSize: 16,
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    color: "#0b1220",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardSubtitle: {
    color: "#4b5563",
    fontSize: 12,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagBubble: {
    backgroundColor: "#0b1220",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  tagLabel: {
    color: "white",
    fontSize: 11,
  },
});
