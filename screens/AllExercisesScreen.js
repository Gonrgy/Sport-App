import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
  const filteredArray = filterLogs(); // Array wird gefiltert anhand einer Funktion.
  const db = useSQLiteContext(); //DataBase für Sql.

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

  //Das höchste Gewicht wird rausgefiltered.
  function get_highest_weight() {
    const array = [...filteredArray];
    const maxId = array.reduce((max, arrayWert) => {
      return arrayWert.weight > max ? arrayWert.weight : max;
    }, 0);
    return maxId;
  }

  // function um die reps etc zu addieren.
  function addieren(angabe) {
    const array = [...filteredArray];
    const addiert = array.reduce((total, exercise) => {
      return total + exercise[angabe];
    }, 0);
    return addiert;
  }

  //function für Einzahl und Mehrzahl
  function mehr_zahl(item, objekt, einZahl, mehrZahl) {
    const a = item[objekt] <= 1 ? einZahl : mehrZahl;
    return a;
  }
  //function to filter exercise Array nach Kategorie.
  function filterLogs() {
    const array = [...exercises];
    const filtered = array.filter((el, index, array) => {
      return el.name === categoryName;
    });
    return filtered;
  }

  //Flatlist design.
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
      </View>
      <Text style={styles.header}>Logged Sessions</Text>
      <Text style={styles.subtitle}>A detailed look at your sessions</Text>

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
            source={require("../assets/übungen/pushups.jpg")}
            style={styles.featuredImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <FlatList
        data={filteredArray}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
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
    backgroundColor: "#121826",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  featuredCategory: {
    color: "#8da0c1",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  featuredTitle: {
    color: "#ffffff",
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
    marginBottom: 8,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  backButtonText: {
    color: "#8da0c1",
    fontWeight: "700",
    fontSize: 14,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#0f1722",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  cardLeft: {
    flex: 1,
  },
  cardCategory: {
    color: "#8da0c1",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  pill: {
    backgroundColor: "#0b1228",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  pillLarge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillText: {
    color: "#8da0c1",
    fontSize: 12,
    fontWeight: "700",
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#1e2733",
    marginLeft: 12,
  },
});
