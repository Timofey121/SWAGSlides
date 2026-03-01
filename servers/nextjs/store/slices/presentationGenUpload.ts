import {
  AudienceType,
  LanguageType,
  PresentationConfig,
  ToneType,
  VerbosityType,
} from "../../app/(presentation-generator)/upload/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PresentationGenUploadState {
  config: PresentationConfig | null;
  
  files: any;

}

const initialState: PresentationGenUploadState = {
  config: {
    audience: AudienceType.Consulting,
    slides: "10",
    language: LanguageType.Russian,
    prompt: "",
    tone: ToneType.Default,
    verbosity: VerbosityType.Standard,
    instructions: "",
    includeTableOfContents: false,
    includeTitleSlide: true,
    webSearch: false,
  },
  files: [],
};

export const presentationGenUploadSlice = createSlice({
  name: "pptGenUpload",
  initialState,
  reducers: {
    setPptGenUploadState: (
      state,
      action: PayloadAction<Partial<PresentationGenUploadState>>
    ) => {
      const payload = action.payload;
      if (payload.config) state.config = payload.config;
      if (payload.files !== undefined) state.files = payload.files;
    },
    updatePptGenUploadConfig: (
      state,
      action: PayloadAction<Partial<PresentationConfig>>
    ) => {
      state.config = { ...(state.config || initialState.config!), ...action.payload };
    },
   
  },
});

export const { setPptGenUploadState, updatePptGenUploadConfig } =
  presentationGenUploadSlice.actions;
export default presentationGenUploadSlice.reducer;
