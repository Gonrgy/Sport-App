import { create } from "zustand";

export const useCategoriesStore = create((set) => {
  return {
    categories: [],
    exercises: [],
    setExercises: (data) => set({ exercises: data }),
    setCategories: (data) => set({ categories: data }),
  };
});
