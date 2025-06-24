import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editedCount: 0,
};

const editedCountSlice = createSlice({
  name: 'editedCount',
  initialState,
  reducers: {
    setEditedCount: (state, action) => {
      state.editedCount = action.payload;
    },
    incrementEditedCount: (state) => {
      state.editedCount += 1;
    },
  },
});

export const { setEditedCount, incrementEditedCount } = editedCountSlice.actions;
export default editedCountSlice.reducer;