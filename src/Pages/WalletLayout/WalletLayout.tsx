import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './WalletLayout.module.scss';
import NotFoundWallet from '../NotFoundWallet/NotFoundWallet';
import Widget from '../../Components/Widget/Widget';
import Asset from '../../Components/Asset/Asset';
import IndexedDBService, { token } from '../../IndexedDB';
import Lottie from 'lottie-react';
import animationData from '../../animations/Animation - empty.json';
import Title from '../../Components/Title/Title';
import AddTokenButton from '../../Components/AddToken/AddTokenButton';
import { useAppDispatch, useAppSelector } from '../../hook';
import AddTokenPopup from '../../Components/AddToken/AddTokenPopup';
import {
  updateTokensInfo,
  changeCurrentPortfolio,
  changes,
  setTokensChangeInfo,
} from '../../store/walletSlice';

import TokenPopup from '../../Components/TokenPopup/TokenPopup';
import { getPriceChange } from '../../BinanceFetch';
import DeletePortfolio from '../../Components/DeletePortfolio/DeletePortfolio';

const WalletLayout = () => {
  const [isloading, setisloading] = React.useState(false);
  const isOpen = useAppSelector((state) => state.isOpen);
  const isTokenOpen = useAppSelector((state) => state.isOpen.isOpenToken);
  const portfolioname = useParams().walletName;
  const [isValidParams, setIsValidParams] = React.useState(true);
  const [SelectedToken, setSelectedToken] = React.useState<token>();

  const dispatch = useAppDispatch();
  let walletInfo = useAppSelector((state) => state.wallet.currentPortfolio);
  let PortfolioTokens = useAppSelector(
    (state) => state.wallet.currentPortfolio.Tokens
  );
  const selectTokenHandle = (token: token) => {
    setSelectedToken(token);
  };

  React.useEffect(() => {
    async function portfolioTokens() {
      const result = await IndexedDBService.getPortfolio(portfolioname!);

      return result;
    }

    if (!portfolioname) return;
    setisloading(true);

    portfolioTokens().then((result) => {
      if (result) {
        setIsValidParams(true);
        dispatch(changeCurrentPortfolio(result));
      } else {
        setIsValidParams(false);
      }
      if (result?.Tokens) {
        dispatch(updateTokensInfo({ Token: result.Tokens }));
        let symbols: string[] = [];
        result.Tokens.forEach((element) => symbols.push(element.id));
        getPriceChange(symbols).then((response) => {
          const array: changes[] = [];
          for (const key in response) {
            array.push({
              tokenID: key,
              currentPrice: response[key].CurrentPrice,
              changes: {
                DayPercent: response[key].PercentChange,
                DayPrice: response[key].PriceChange,
              },
            });
          }
          dispatch(setTokensChangeInfo(array));
          setisloading(false);
        });
      }
    });
  }, [portfolioname]);
  React.useEffect(() => {
    let symbols: string[] = [];
    if (PortfolioTokens) {
      PortfolioTokens.forEach((element) => symbols.push(element.id));
      getPriceChange(symbols).then((response) => {
        const array: changes[] = [];
        for (const key in response) {
          array.push({
            tokenID: key,
            currentPrice: response[key].CurrentPrice,
            changes: {
              DayPercent: response[key].PercentChange,
              DayPrice: response[key].PriceChange,
            },
          });
        }

        dispatch(setTokensChangeInfo(array));
        setisloading(false);
      });
    }
  }, [PortfolioTokens?.length]);

  return (
    <>
      {isValidParams ? (
        <>
          {walletInfo && walletInfo.Tokens ? (
            <div className={styles.container}>
              {isOpen.isOpen && <AddTokenPopup PopupId={portfolioname!} />}
              {isTokenOpen && SelectedToken && (
                <TokenPopup tokenInfo={SelectedToken} />
              )}
              <section className={styles.head}>
                <Title
                  id={portfolioname!}
                  name={walletInfo.name}
                  Tokens={walletInfo.Tokens}
                />
                <AddTokenButton />
                <DeletePortfolio />
              </section>
              <Widget isLoading={isloading} />
              <section className={styles.titles}>
                <div className={styles.columnTitle}>Token</div>
                <div className={styles.columnTitle}>Price $</div>
                <div className={styles.columnTitle}>Quantity</div>
                <div className={styles.columnTitle}>Total $</div>
              </section>
              {walletInfo && walletInfo.Tokens.length > 0 ? (
                <section className={styles.assets}>
                  {walletInfo.Tokens?.map((token) => {
                    return (
                      <Asset
                        selectToken={selectTokenHandle}
                        isloading={isloading}
                        tokenName={token.id}
                        price={token.currentPrice}
                        quantity={token.quantity}
                        total={token.currentPrice * token.quantity}
                      />
                    );
                  })}
                </section>
              ) : (
                <div className={styles.animation}>
                  <Lottie animationData={animationData} />
                </div>
              )}
            </div>
          ) : (
            <NotFoundWallet />
          )}
        </>
      ) : (
        <NotFoundWallet />
      )}
    </>
  );
};
export default WalletLayout;
