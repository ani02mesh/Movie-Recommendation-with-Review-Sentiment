import { configureStore } from "@reduxjs/toolkit";
import cineReducer from "./cineSlice";

export const store = configureStore({
  reducer: {
    cineData: cineReducer,
  },
});
