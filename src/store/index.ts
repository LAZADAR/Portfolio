import { configureStore } from '@reduxjs/toolkit';
import WalletReducer from './walletSlice';
import BinanceTokensReducer from './BinanceTokensSlice';
import isOpenReducer from './OpenPopup';
const store = configureStore({
  reducer: {
    wallet: WalletReducer,
    binanceTokens: BinanceTokensReducer,
    isOpen: isOpenReducer,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
