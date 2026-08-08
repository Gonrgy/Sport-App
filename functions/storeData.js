import { create } from "zustand";

export const useCategoriesStore = create((set) => {
  return {
    categories: [],
    exercises: [],
    selectedCategory: "",
    setSelectedCategory: (data) => set({ selectedCategory: data }),
    setExercises: (data) => set({ exercises: data }),
    setCategories: (data) => set({ categories: data }),
  };
});
