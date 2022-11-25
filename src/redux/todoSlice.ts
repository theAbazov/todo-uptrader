import { createSlice } from "@reduxjs/toolkit";

interface init {
  isLoading: boolean;
}

const initialState: init = {
  isLoading: false,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setLoad: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoad } = todoSlice.actions;

export default todoSlice.reducer;
