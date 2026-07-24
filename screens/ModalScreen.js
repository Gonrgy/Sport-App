import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { save_in_exercise_entries_handler } from "../functions/functionsSqLite";
import { useCategoriesStore } from "../functions/storeData";

export default function ModalScreen({ route, navigation }) {
  const { exercise, subtitle, image, tags } = route.params;
  const [reps, setReps] = useState(0);
  const [dauer, setDauer] = useState(0);
  const [gewicht, setGewicht] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categories = useCategoriesStore((state) => state.categories);
  const setExercises = useCategoriesStore((state) => state.setExercises);
  const exercises = useCategoriesStore((state) => state.exercises);
  const isFocused = useIsFocused();
  const db = useSQLiteContext();

  async function save_exercise_data() {
    try {
      await save_in_exercise_entries_handler(
        db,
        selectedCategory,
        exercise,
        reps,
        gewicht,
        dauer,
        setExercises,
        exercises,
      );
    } catch (e) {
      Alert.alert("Fehler", "Bitte beachten Sie Ihre eingaben");
      console.log("Fehler " + e);
    }
  }

  return (
    <Modal visible={isFocused} animationType="slide" transparent>
      <SafeAreaView style={styles.overlay}>
        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modal}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>LOG AKTIVITÄT</Text>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.exerciseTitle}>{exercise}</Text>
            <Text style={styles.exerciseSubtitle}>{subtitle}</Text>

            <View style={styles.imageCard}>
              <Image source={image} style={styles.image} />
              <View style={styles.cardLabelContainer}>
                <Text style={styles.cardLabel}>Reps & Dauer</Text>
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Wiederholungen (Reps):</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() => {
                    setReps((prev) => {
                      if (prev <= 0) return 0;
                      return prev - 1;
                    });
                  }}
                  style={styles.stepperButton}
                >
                  <Text style={styles.stepperButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{reps}</Text>
                <TouchableOpacity
                  onLongPress={() => {
                    setReps((prev) => {
                      return prev + 5;
                    });
                  }}
                  onPress={() => {
                    setReps((prev) => {
                      return prev + 1;
                    });
                  }}
                  style={styles.stepperButton}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Dauer (Sek):</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() => {
                    setDauer((prev) => {
                      if (prev <= 0) return 0;
                      return prev - 1;
                    });
                  }}
                  style={styles.stepperButton}
                >
                  <Text style={styles.stepperButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{dauer}s</Text>
                <TouchableOpacity
                  onLongPress={() => {
                    setDauer((prev) => {
                      return prev + 5;
                    });
                  }}
                  onPress={() => {
                    setDauer((prev) => {
                      return prev + 1;
                    });
                  }}
                  style={styles.stepperButton}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Gewicht (kg):</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() => {
                    setGewicht((prev) => {
                      if (prev <= 0) return 0;
                      return prev - 1;
                    });
                  }}
                  style={styles.stepperButton}
                >
                  <Text style={styles.stepperButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{gewicht} kg</Text>
                <TouchableOpacity
                  onLongPress={() => {
                    setGewicht((prev) => {
                      return prev + 5;
                    });
                  }}
                  onPress={() => {
                    setGewicht((prev) => {
                      return prev + 1;
                    });
                  }}
                  style={styles.stepperButton}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Kategorie:</Text>
              <TouchableOpacity
                onPress={() => setCategoryOpen((prev) => !prev)}
                style={styles.dropdownTrigger}
              >
                <Text style={styles.dropdownTriggerText}>
                  {selectedCategory || "Kategorie wählen"}
                </Text>
                <Text style={styles.dropdownArrow}>
                  {categoryOpen ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
              {categoryOpen && (
                <View style={styles.dropdownList}>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <TouchableOpacity
                        key={category.name ?? category}
                        onPress={() => {
                          setSelectedCategory(category.name || category);
                          setCategoryOpen(false);
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>
                          {category.name || category}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.dropdownEmpty}>
                      Keine Kategorien verfügbar
                    </Text>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={async () => {
                const ausgewählteCategory = selectedCategory.trim();
                if (!ausgewählteCategory) {
                  Alert.alert(
                    "Kategorie",
                    "Bitte wählen Sie eine Kategorie aus oder erstellen Sie eines.",
                  );
                } else {
                  await save_exercise_data();
                  console.log(JSON.stringify(exercises, null, 2));
                  navigation.goBack();
                }
              }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>LOG SPEICHERN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  modal: {
    backgroundColor: "#101824",
    borderRadius: 24,
    padding: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  modalScroll: {
    flex: 1,
    width: "100%",
  },
  modalContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    color: "#d8e3f6",
    fontSize: 12,
    letterSpacing: 1.8,
    fontWeight: "700",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  exerciseTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  exerciseSubtitle: {
    color: "#7fa1cf",
    fontSize: 13,
    marginBottom: 14,
  },
  imageCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    marginBottom: 14,
  },
  image: {
    width: "100%",
    height: 160,
  },
  cardLabelContainer: {
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  cardLabel: {
    color: "#0b1220",
    fontSize: 11,
    fontWeight: "700",
  },
  inputBlock: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#9fb0cb",
    fontSize: 12,
    marginBottom: 10,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  stepperButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#29c872",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1da35b",
  },
  stepperButtonText: {
    color: "#ffffff",
    fontSize: 22,
    lineHeight: 24,
  },
  stepperValue: {
    color: "#0b1220",
    fontSize: 18,
    fontWeight: "700",
    minWidth: 54,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#29c872",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#08121e",
    fontWeight: "800",
    fontSize: 15,
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownTriggerText: {
    color: "#0b1220",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownArrow: {
    color: "#0b1220",
    fontSize: 14,
  },
  dropdownList: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(11, 18, 32, 0.08)",
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    color: "#0b1220",
    fontSize: 15,
    fontWeight: "bold",
  },
  dropdownEmpty: {
    color: "#0b1220",
    fontSize: 14,
    padding: 16,
    textAlign: "center",
  },
});
