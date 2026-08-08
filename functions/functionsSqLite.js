import { Alert } from "react-native";
import { useCategoriesStore } from "./storeData";

export async function pragma_setzen(db) {
  try {
    const query = `PRAGMA foreign_keys = ON;`;
    db.execAsync(query);
  } catch (e) {}
}

export async function create_table_kategorie(db) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);`;
    await db.execAsync(query);
  } catch (error) {}
}

export async function create_table(db) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS exercise_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    exerciseName TEXT NOT NULL,
    reps INTEGER,
    weight INTEGER,
    duration INTEGER,

    FOREIGN KEY (name)
        REFERENCES categories(name)
        ON DELETE CASCADE
);`;
    await db.execAsync(query);
  } catch (error) {}
}

//Tabelle wo übungen reps etc sind.
export async function read_exercise_entries_data_handler(db, setArray) {
  try {
    const query = `SELECT * FROM exercise_entries`;
    const allRows = await db.getAllAsync(query);
    setArray(allRows);
  } catch (e) {}
}

//Categories Tabelle
export async function read_categories_data_handler(db, setArray) {
  try {
    const query = `SELECT * FROM categories`;
    const allRows = await db.getAllAsync(query);
    setArray(allRows);
  } catch (e) {}
}

export async function save_in_categories_handler(
  db,
  textInput,
  setCategories,
  lastArray,
) {
  try {
    const query = `INSERT INTO categories (name) VALUES (?)`;
    const result = await db.runAsync(query, [textInput]);
    const id = result.lastInsertRowId;
    const array = [...lastArray];
    array.push({ id: id, name: textInput });
    setCategories(array);
  } catch (e) {
    Alert.alert("Kategorie", "Konnte nicht in Sqlite gespeichert werden.");
  }
}

export async function save_in_exercise_entries_handler(
  db,
  name,
  exerciseName,
  reps,
  weight,
  duration,
  setExercises,
  lastArray,
) {
  try {
    const query = `INSERT INTO exercise_entries (name, exerciseName, reps, weight, duration)
   VALUES (?, ?, ?, ?, ?)`;
    const result = await db.runAsync(query, [
      name,
      exerciseName,
      reps,
      weight,
      duration,
    ]);
    const newId = result.lastInsertRowId;
    const array = [...lastArray];
    array.push({
      id: newId,
      name: name,
      exerciseName: exerciseName,
      reps: reps,
      weight: weight,
      duration: duration,
    });
    setExercises(array);
  } catch (e) {}
}

export async function delete_one_category(db, id) {
  try {
    const query = `DELETE FROM categories WHERE id = ?`;
    db.runAsync(query, [id]);
  } catch (error) {
    Alert.alert("Kategorie", "Konnte nicht in Sqlite gelöscht werden.");
  }
}

//Eine übung wird gelöscht von der Tabelle (NICHT CATEGORY).
export async function delete_one_exercise(db, id) {
  try {
    const query = `DELETE FROM exercise_entries WHERE id = ?`;
    db.runAsync(query, [id]);
  } catch (error) {}
}

//Tabelle löschen.
export async function delete_table(db) {
  try {
    const query = `DROP TABLE IF EXISTS exercise_entries;`;
    await db.execAsync(query);
  } catch (e) {}
}

//All Tabellen werden angezegt in der console.
export async function alle_tabellen(db) {
  try {
    const tables = await db.getAllAsync(`
  SELECT name 
  FROM sqlite_master 
  WHERE type='table'
  ORDER BY name;
`);
  } catch (e) {}
}
