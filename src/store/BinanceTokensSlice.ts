import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type tokenlist = {
  tokenList: string[];
};
const initialState: tokenlist = {
  tokenList: [],
};

const BinanceTokensSlice = createSlice({
  name: 'BinanceTokens',
  initialState,
  reducers: {
    UpdateTokens(state, action: PayloadAction<string[]>) {
      state.tokenList = action.payload;
    },
  },
});
export const { UpdateTokens } = BinanceTokensSlice.actions;
export default BinanceTokensSlice.reducer;
