import { configureStore } from "@reduxjs/toolkit";
import todo from "./todoSlice";

export const store = configureStore({
  reducer: todo,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
