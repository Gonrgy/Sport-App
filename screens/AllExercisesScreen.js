import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCategoriesStore } from "../functions/storeData";
import { imageMap } from "../data/exercises";
import { delete_one_exercise } from "../functions/functionsSqLite";
import { useSQLiteContext } from "expo-sqlite";

export default function AllExercisesScreen({ navigation, route }) {
  const { categoryName } = route.params || {}; // Gibt mir den Kategorie namen zum filtern der Daten.
  const exercises = useCategoriesStore((state) => state.exercises); // store Array.
  const setExercises = useCategoriesStore((state) => state.setExercises); // store Array.
  const [expandedSections, setExpandedSections] = useState({}); // Array wo die werte mit true oder false angegeben sind damit man weiß wer offen ist und wer nicht.
  const filteredArray = filterLogs(); // Array wird gefiltert anhand einer Funktion.
  const sections = sectionLogs(filteredArray);
  const db = useSQLiteContext(); //DataBase für Sql.

  //function um die reps, dauer etc. zu addieren.
  function addieren(angabe) {
    const array = [...filteredArray];
    const addiert = array.reduce((total, exercise) => {
      return total + exercise[angabe];
    }, 0);
    return addiert;
  }
  // Das Maximale höchstgewicht wird gefiltered.
  function get_highest_weight() {
    const array = [...filteredArray];
    const maxId = array.reduce((max, arrayWert) => {
      return arrayWert.weight > max ? arrayWert.weight : max;
    }, 0);
    return maxId;
  }

  // ändert die Farbe von den angezeigten Übungen wenn sie geöffnet werden.
  function style_handler(
    section,
    style,
    backgroundColorTrue,
    backgroundColorFalse,
    objectName,
  ) {
    const design = expandedSections[section.title]
      ? [style, { [objectName]: backgroundColorTrue }]
      : [style, { [objectName]: backgroundColorFalse }];
    return design;
  }

  //Sorgt dafür das wenn man auf die Übung klickt die Übung geöffnet wird oder geschlossen wird.
  const visibleSections = sections.map((section) => ({
    ...section,
    data: expandedSections[section.title] ? section.data : [],
  }));

  //Overlays variablen für reps,dauer etc.
  const repsAnzeige = addieren("reps");
  const duration = addieren("duration");
  const maxWeight = get_highest_weight();

  //Die Daten in dem Array werden gelöscht der Array ist nicht gefiltert.
  function delete_one_exercise_from_complete_array(item) {
    const array = [...exercises];
    const filterData = array.filter((el, index, array) => {
      return item.id != el.id;
    });
    setExercises(filterData);
  }

  /*
  // function um die reps etc zu addieren.
  function addieren(angabe) {
    const array = [...filteredArray];
    const addiert = array.reduce((total, exercise) => {
      return total + exercise[angabe];
    }, 0);
    return addiert;
  }
*/
  //function für Einzahl und Mehrzahl
  function mehr_zahl(item, objekt, einZahl, mehrZahl) {
    const a = item[objekt] <= 1 ? einZahl : mehrZahl;
    return a;
  }
  //function to filter exercise Array nach Kategorie.
  function filterLogs() {
    const array = [...exercises];
    const filtered = array.filter((el) => el.name === categoryName);
    return filtered;
  }

  function sectionLogs(filtered) {
    const grouped = filtered.reduce((acc, item) => {
      const key = item.exerciseName || "Unbekannt";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b, "de", { sensitivity: "base" }))
      .map((title) => {
        const data = grouped[title];
        return {
          title,
          data,
          totalReps: data.reduce((sum, item) => sum + (item.reps ?? 0), 0),
          totalWeight: data.reduce(
            (sum, item) => (item.weight > sum ? item.weight : sum),
            0,
          ),
          totalDuration: data.reduce(
            (sum, item) => sum + (item.duration ?? 0),
            0,
          ),
        };
      });
  }

  function toggleSection(title) {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }

  //SectionList design.
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => {
        Alert.alert("Löschen", "Möchten Sie es wirklich löschen ?", [
          {
            text: "Ja",
            style: "default",
            onPress: async () => {
              delete_one_exercise_from_complete_array(item);
              await delete_one_exercise(db, item.id);
            },
          },
          { text: "Nein", style: "cancel" },
        ]);
      }}
      style={styles.card}
      activeOpacity={0.9}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardCategory}>{item.exerciseName}</Text>
        <Text style={styles.cardTitle}>{item.exerciseName}</Text>
        <View style={styles.row}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {item.reps} {mehr_zahl(item, "reps", "rep", "reps")}
            </Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{item.weight} kg</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {(item.duration ?? 0) + " "}
              {mehr_zahl(item, "duration", "sekunde", "sekunden")}
            </Text>
          </View>
        </View>
      </View>
      <Image
        source={imageMap[item.exerciseName]}
        style={styles.thumbnail}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{"<"} Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Dashboard");
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Übungen</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Logged Sessions</Text>
      <Text style={styles.subtitle}>A detailed at your sessions</Text>

      <View style={styles.featuredCard}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.featuredCategory}>Gesamt</Text>
            <Text style={styles.featuredTitle}>Gesamt</Text>
            <View style={[styles.row, { marginTop: 12 }]}>
              <View style={[styles.pill, styles.pillLarge]}>
                <Text style={styles.pillText}>{repsAnzeige + " reps"}</Text>
              </View>
              <View style={[styles.pill, styles.pillLarge]}>
                <Text style={styles.pillText}>{maxWeight + " max kg"}</Text>
              </View>
              <View style={[styles.pill, styles.pillLarge]}>
                <Text style={styles.pillText}>{duration + " s"}</Text>
              </View>
            </View>
          </View>
          <Image
            source={require("../assets/uebungen/outdoor.jpg")}
            style={styles.featuredImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <SectionList
        sections={visibleSections}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <TouchableOpacity
            onPress={() => toggleSection(section.title)}
            style={style_handler(
              section,
              styles.sectionHeader,
              "#94A3B8",
              "white",
              "backgroundColor",
            )}
            activeOpacity={0.8}
          >
            <Text
              style={style_handler(
                section,
                styles.sectionHeaderText,
                "white",
                "black",
                "color",
              )}
            >
              {section.title}
            </Text>
            <View style={styles.sectionHeaderStats}>
              <View style={styles.headerStatPill}>
                <Text
                  style={style_handler(
                    section,
                    styles.headerStatText,
                    "white",
                    "black",
                    "color",
                  )}
                >
                  {section.totalReps + " reps"}
                </Text>
              </View>
              <View style={styles.headerStatPill}>
                <Text
                  style={style_handler(
                    section,
                    styles.headerStatText,
                    "white",
                    "black",
                    "color",
                  )}
                >
                  {section.totalWeight + " max kg"}
                </Text>
              </View>
              <View style={styles.headerStatPill}>
                <Text
                  style={style_handler(
                    section,
                    styles.headerStatText,
                    "white",
                    "black",
                    "color",
                  )}
                >
                  {section.totalDuration + " sec"}
                </Text>
              </View>
              <Text style={styles.collapseIcon}>
                {expandedSections[section.title] ? "▾" : "▸"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
    padding: 18,
  },
  header: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#8da0c1",
    marginTop: 6,
    marginBottom: 18,
  },
  featuredCard: {
    backgroundColor: "#f7fdf9",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#1f2937",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  featuredCategory: {
    color: "#1f2937",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  featuredTitle: {
    color: "#1f2937",
    fontSize: 22,
    fontWeight: "800",
  },
  featuredImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginLeft: 12,
    backgroundColor: "#1e2733",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  backButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#94A3B8",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  cardLeft: {
    flex: 1,
    marginRight: 8,
  },
  cardCategory: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
    flexShrink: 1,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
    flexShrink: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  pill: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 6,
  },
  pillLarge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillText: {
    color: "black",
    fontSize: 13,
    fontWeight: "800",
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#1e2733",
    marginLeft: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,

    borderRadius: 12,
    marginBottom: 10,
    gap: 8,
  },
  sectionHeaderText: {
    color: "black",
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  sectionHeaderStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerStatPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  headerStatText: {
    color: "black",
    fontSize: 13,
    fontWeight: "800",
  },
  collapseIcon: {
    color: "black",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "700",
  },
});
