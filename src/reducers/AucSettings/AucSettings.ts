import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactText } from 'react';

export interface SettingFields {
  isSubscribed?: boolean;
  startTime?: ReactText;
}

interface AucSettingsState {
  settings: SettingFields;
}

export const initialState: AucSettingsState = {
  settings: {
    isSubscribed: false,
    startTime: 10,
  },
};

const aucSettingsSlice = createSlice({
  name: 'aucSettings',
  initialState,
  reducers: {
    setAucSettings(state, action: PayloadAction<SettingFields>): void {
      state.settings = action.payload;
    },
  },
});

export const { setAucSettings } = aucSettingsSlice.actions;

export default aucSettingsSlice.reducer;