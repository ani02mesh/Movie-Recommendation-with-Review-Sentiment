import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cardData: [],
  allMovieData: [],
  filteredMovieData: [],
};

const cineSlice = createSlice({
  name: "cine",
  initialState,
  reducers: {
    setCardData: (state, action) => {
      state.cardData = action.payload; // Only store df1
    },
    setAllMovieData: (state, action) => {
      state.allMovieData = action.payload; // Store data from the second API
    },
    setFilteredMovieData: (state, action) => {
      state.filteredMovieData = action.payload; // Store data from the second API
    },
  },
});

export const { setCardData, setAllMovieData, setFilteredMovieData } =
  cineSlice.actions;
export default cineSlice.reducer;
