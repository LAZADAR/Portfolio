import IndexedDBService, { Portfolio } from './IndexedDB';
import { PriceList, addPortfoliosName } from './store/walletSlice';
import { useAppDispatch } from './hook';
import { getSpotPriceForPair } from './BinanceFetch';

type CustomDispatch = ReturnType<typeof useAppDispatch>;
export type price = {
  tokenID: string;
  price: number;
};
export function formatNumber(num: number): string {
  if (num >= 1000000000 || num <= -1000000000) {
    return (num / 1000000000).toFixed(2) + ' B';
  } else if (num >= 1000000 || num <= -1000000) {
    return (num / 1000000).toFixed(2) + ' M';
  } else if (Number.isInteger(num)) {
    return num.toString();
  } else return num.toFixed(2);
}
export async function ActualizePortfolios(dispatch: CustomDispatch) {
  const portfolios = await IndexedDBService.getAllPortfoliosName();

  portfolios.forEach((element) =>
    dispatch(addPortfoliosName({ id: element.id, name: element.name }))
  );
}

export async function UpdateTokensPrice(
  portfolio: Portfolio
): Promise<price[] | undefined> {
  if (!portfolio || !portfolio.Tokens) {
    return undefined;
  }
  if (portfolio && portfolio.Tokens) {
    console.log('Update Token PRICE...');
    console.log(portfolio);

    const PricePromises = portfolio.Tokens.map((token) =>
      getSpotPriceForPair(token.id)
        .then((response) => {
          if (response) return { tokenID: token.id, price: response };
          else return { tokenID: token.id, price: 0 };
        })
        .catch((error) => ({ tokenID: token.id, price: 0 }))
    );

    return Promise.all(PricePromises).then((prices) => {
      if (prices) return prices;
    });
  }
}
