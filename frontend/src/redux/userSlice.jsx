import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  svgTemplateFront: null,
  svgTemplateBack: null,
};

const svgSlice = createSlice({
  name: "svg",
  initialState,
  reducers: {
    setSvgTemplate: (state, action) => {
      state.svgTemplateFront = action.payload.front;
      state.svgTemplateBack = action.payload.back;
    },
    setSvgFront: (state, action) => {
      state.svgTemplateFront = action.payload;
    },
    setSvgBack: (state, action) => {
      state.svgTemplateBack = action.payload;
    },
  },
});

export const { setSvgTemplate, setSvgFront, setSvgBack } = svgSlice.actions;
export default svgSlice.reducer;
