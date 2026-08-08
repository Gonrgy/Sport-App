import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { insert_into_categorys } from "../functions/functionsSqLite";
import { useSQLiteContext } from "expo-sqlite";
import {
  read_categories_data_handler,
  read_exercise_entries_data_handler,
  save_in_categories_handler,
} from "../functions/functionsSqLite";
import { useCategoriesStore } from "../functions/storeData";
import { delete_one_category } from "../functions/functionsSqLite";

//  DEINE WORKOUT KATEGORIEN SCREEN.
export default function SelectedExercisesScreen({ navigation }) {
  const [userInput, setUserInput] = useState("");
  const db = useSQLiteContext();
  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  function filter_category_array(item) {
    const array = [...categories];
    const filter = array.filter((el, index, array) => {
      return item.id != el.id;
    });
    setCategories(filter);
  }

  function delete_one_category_from_array_handler(item) {
    Alert.alert(
      "Löschen",
      "Sind sie sicher das sie die Kategorie löschen möchten?",
      [
        {
          text: "ja",
          style: "default",
          onPress: async () => {
            await delete_one_category(db, item.id);
            filter_category_array(item);
          },
        },
        { text: "Nein", style: "cancel" },
      ],
    );
  }

  function text_input_handler(text) {
    setUserInput(text);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Deine Workout-Kategorien</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Neue Kategorie erstellen..."
          placeholderTextColor="#8da0c1"
          style={styles.input}
          onChangeText={(text) => {
            text_input_handler(text);
          }}
          value={userInput}
        />
        <TouchableOpacity
          onPress={async () => {
            const dateNow = new Date().toLocaleDateString("de-DE");
            const userInputWithDate = `${userInput} - (${dateNow})`;
            const input = userInputWithDate.toLowerCase();
            const exists = categories.some((el) => {
              return el.name.toLowerCase() === input;
            });
            if (!userInput.trim()) {
              Alert.alert(
                "Kein Name vorhanden",
                "Bitte geben Sie einen Namen ein.",
              );
            } else if (exists) {
              Alert.alert(
                "Name Existiert",
                "Dieser Name existiert bereits.Bitte geben Sie einen anderen Namen ein.",
              );
            } else {
              await save_in_categories_handler(
                db,
                userInputWithDate,
                setCategories,
                categories,
              );
              /////////////////////////////////
            }
            setUserInput("");
          }}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {categories.map((category) => (
          <TouchableOpacity
            onLongPress={() => {
              delete_one_category_from_array_handler(category);
            }}
            key={category.id}
            activeOpacity={0.8}
            style={styles.categoryCard}
            onPress={() => {
              console.log("gedrückt: " + category.name);
              navigation.navigate("AllExercises", {
                categoryName: category.name,
              });
            }}
          >
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
    paddingHorizontal: 16,
  },
  heading: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#131a2c",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    padding: 0,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#38b6ff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  addButtonText: {
    color: "#08121e",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  categoryCard: {
    backgroundColor: "white",
    borderRadius: 22,
    marginBottom: 14,
    overflow: "hidden",
  },
  categoryHeader: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    color: "#08121e",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    flexShrink: 1,
  },
});
