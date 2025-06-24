import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDesignById = createAsyncThunk(
  "design/fetchById",
  async (designId) => {
    const response = await fetch(`http://localhost:3000/design/${designId}`);
    const data = await response.json();
    return data;
  }
);

const designSlice = createSlice({
  name: "design",
  initialState: {
    currentDesign: null,
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDesignById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentDesign = action.payload;
      })
      .addCase(fetchDesignById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default designSlice.reducer;
