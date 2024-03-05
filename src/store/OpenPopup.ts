import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  isOpenToken: false,
};

const isOpenSlice = createSlice({
  name: 'isPopupOpen',
  initialState,
  reducers: {
    isOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    isOpenToken(state, action: PayloadAction<boolean>) {
      state.isOpenToken = action.payload;
    },
  },
});
export const { isOpen, isOpenToken } = isOpenSlice.actions;
export default isOpenSlice.reducer;
