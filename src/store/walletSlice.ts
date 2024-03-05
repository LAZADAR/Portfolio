import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { Portfolio } from '../IndexedDB';
import { token } from '../IndexedDB';
export type CurrrenPrice = {
  tokenID: string;
  price: number;
};
export type PriceList = {
  tokensPrice: CurrrenPrice[];
};
export type changes = {
  tokenID: string;
  currentPrice: number;
  changes: {
    DayPercent: number;
    DayPrice: number;
  };
};
type Tokenlist = {
  Token: token | token[];
};
export type PortfolioNames = {
  id: string;
  name: string;
};
type WalletState = {
  walletList: PortfolioNames[];
  currentPortfolio: Portfolio;
};
const initialState: WalletState = {
  currentPortfolio: { id: '', name: '', Tokens: [] },
  walletList: [],
};
const walletSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    removePortfoliosName(state, action: PayloadAction<string>) {
      const index = state.walletList.findIndex(
        (element) => element.id === action.payload
      );
      if (index !== -1) {
        console.log('DELETEING');

        if (state.walletList.length > 1) state.walletList.splice(index, 1);
        else state.walletList = [];
      }
    },
    addPortfoliosName(state, action: PayloadAction<PortfolioNames>) {
      const index = state.walletList.findIndex(
        (element) => element.id === action.payload.id
      );

      if (index === -1) state.walletList.push(action.payload);
      else {
        state.walletList[index].name = action.payload.name;
      }
    },
    updatePortfoliosNames(state, action: PayloadAction<PortfolioNames>) {
      const index = state.walletList.findIndex(
        (element) => element.id === action.payload.id
      );

      if (index !== -1) {
        state.walletList[index].name = action.payload.name;
      }
    },
    changeCurrentPortfolio(state, action: PayloadAction<Portfolio>) {
      state.currentPortfolio = action.payload;
    },
    addTokenInPortfolio(state, action: PayloadAction<Tokenlist>) {
      if (action.payload.Token instanceof Array) {
        action.payload.Token.forEach((token) => {
          const index = state.currentPortfolio.Tokens?.findIndex(
            (element) => element.id === token.id
          );

          if (index! > -1 && state.currentPortfolio.Tokens) {
            let TotalPrice =
              state.currentPortfolio.Tokens[index!].quantity *
              state.currentPortfolio.Tokens[index!].buyPrice;
            let TotalQuantity = state.currentPortfolio.Tokens[index!].quantity;
            state.currentPortfolio.Tokens[index!].buyPrice =
              (TotalPrice + token.buyPrice * token.quantity) /
              (TotalQuantity + token.quantity);
            state.currentPortfolio.Tokens[index!].transactions.push({
              date: new Date(Date.now()).getTime(),
              price: token.buyPrice,
              quantity: token.quantity,
            });
          } else state.currentPortfolio.Tokens?.push(token);
        });
      } else {
        const token = action.payload.Token;
        const index = state.currentPortfolio.Tokens?.findIndex(
          (element) => element.id === token.id
        );

        if (index! > -1 && state.currentPortfolio.Tokens) {
          console.log('INSIDE CHANGE');

          let TotalPrice =
            state.currentPortfolio.Tokens[index!].quantity *
            state.currentPortfolio.Tokens[index!].buyPrice;
          let TotalQuantity = state.currentPortfolio.Tokens[index!].quantity;
          state.currentPortfolio.Tokens[index!].quantity =
            TotalQuantity + token.quantity;
          state.currentPortfolio.Tokens[index!].buyPrice =
            (TotalPrice + token.buyPrice * token.quantity) /
            (TotalQuantity + token.quantity);
          state.currentPortfolio.Tokens[index!].transactions.push({
            date: new Date(Date.now()).getTime(),
            price: token.buyPrice,
            quantity: token.quantity,
          });
        } else
          state.currentPortfolio.Tokens?.push({
            ...action.payload.Token,
            transactions: [
              {
                date: new Date(Date.now()).getTime(),
                price: token.buyPrice,
                quantity: token.quantity,
              },
            ],
          });
      }
    },
    updateTokensInfo(state, action: PayloadAction<Tokenlist>) {
      if (action.payload.Token instanceof Array) {
        state.currentPortfolio.Tokens = action.payload.Token;
      } else state.currentPortfolio.Tokens = [action.payload.Token];
    },
    setTokensChangeInfo(state, action: PayloadAction<changes[]>) {
      action.payload.forEach((element) => {
        const index = state.currentPortfolio.Tokens?.findIndex(
          (el) => el.id === element.tokenID
        );
        if (
          index !== undefined &&
          index >= 0 &&
          state.currentPortfolio.Tokens
        ) {
          state.currentPortfolio.Tokens[index] = {
            ...state.currentPortfolio.Tokens[index],
            currentPrice: element.currentPrice,
            changes: element.changes,
          };
        }
      });
    },
    removeToken(state, action: PayloadAction<number>) {
      state.currentPortfolio.Tokens?.splice(action.payload, 1);
    },
  },
});

export const {
  changeCurrentPortfolio,
  addTokenInPortfolio,
  addPortfoliosName,
  updateTokensInfo,
  updatePortfoliosNames,
  setTokensChangeInfo,
  removeToken,
  removePortfoliosName,
} = walletSlice.actions;
export default walletSlice.reducer;
