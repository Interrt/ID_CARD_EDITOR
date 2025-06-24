// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";
import svgReducer from "./userSlice"; // Make sure file name is userSlice.js
import editedCountReducer from './counterSlice';
const membersSlice = createSlice({
  name: "members",
  initialState: [],
  reducers: {
    addMember: (state, action) => {
      state.push(action.payload);
    },
    setMembers: (state, action) => action.payload,
    clearMembers: () => [],
  },
});

export const { addMember, setMembers, clearMembers } = membersSlice.actions;

const store = configureStore({
  reducer: {
    members: membersSlice.reducer,
    svg: svgReducer, // Connected correctly
    editedCount: editedCountReducer,
  },
});

export default store;
