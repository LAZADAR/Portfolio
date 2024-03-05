import React from 'react';
import styles from './Widget.module.scss';
import Lottie from 'lottie-react';
import loadinganimation from '../../animations/Animation - LoadingHand.json';
import { formatNumber, price } from '../../Tools';
import { useAppSelector } from '../../hook';
type WidgetInfo = {
  isLoading: boolean;
};
type stats = {
  TotalCost: string;
  PercentChange: string;
  MoneyChange: string;
  DayPercentChange: string;
  DayMoneyChange: string;
};
type changes = {
  PercentChange: number;
  PriceChange: number;
};
const Widget: React.FC<WidgetInfo> = (props) => {
  const [getingData, setGetingData] = React.useState(true);
  const tokens = useAppSelector(
    (state) => state.wallet.currentPortfolio.Tokens
  );

  const [stats, setStats] = React.useState<stats>();

  React.useEffect(() => {
    setGetingData(true);

    const DayChanges: changes = { PercentChange: 0, PriceChange: 0 };

    let BaseCost = 0;
    let Total = 0;
    setStats(undefined);

    tokens?.forEach((element) => {
      BaseCost += element.buyPrice * element.quantity;
      Total += element.currentPrice * element.quantity;
    });
    tokens?.forEach((element) => {
      const isyesterday = element.transactions.findIndex(
        (transaction) => transaction.date < Date.now() - 86400000
      );

      if (isyesterday !== -1) {
        //if token added more than day ago
        DayChanges.PriceChange += element.changes.DayPrice * element.quantity;
      } else {
        //if token added today

        DayChanges.PriceChange +=
          (element.currentPrice - element.buyPrice) * element.quantity;
      }
    });
    DayChanges.PercentChange =
      (DayChanges.PriceChange / (Total - DayChanges.PriceChange)) * 100;

    const money = Total - BaseCost;
    let percent;
    if (money < 0) {
      percent = (Total / BaseCost) * 100 - 100;
    } else percent = 100 - (BaseCost / Total) * 100;

    setStats({
      TotalCost: Total.toFixed(2),
      PercentChange: percent.toFixed(2),
      MoneyChange: money.toFixed(2),
      DayPercentChange: DayChanges.PercentChange.toFixed(2),
      DayMoneyChange: DayChanges.PriceChange.toFixed(2),
    });
    setGetingData(false);
  }, [tokens]);

  return (
    <div className={styles.container}>
      {tokens?.length ? (
        <>
          {!getingData &&
          !props.isLoading &&
          stats &&
          stats?.TotalCost !== '0.00' ? (
            <>
              <section className={styles.info}>
                <div className={styles.left}>
                  <p>Total balance | PNL</p>
                  <p className={styles.strong}>
                    {formatNumber(parseFloat(stats?.TotalCost))} $
                  </p>
                  <p
                    className={` ${
                      stats?.MoneyChange.startsWith('-')
                        ? styles.negative
                        : styles.positive
                    }`}
                  >
                    {formatNumber(parseFloat(stats?.MoneyChange))} $
                  </p>
                  <p
                    className={` ${
                      stats?.PercentChange.startsWith('-')
                        ? styles.negative
                        : styles.positive
                    }`}
                  >
                    {stats?.PercentChange} %
                  </p>
                </div>
                <div className={styles.right}>
                  <p>PNL today</p>
                  <p
                    className={` ${
                      stats?.DayMoneyChange.startsWith('-')
                        ? styles.negative
                        : styles.positive
                    }`}
                  >
                    {formatNumber(parseFloat(stats?.DayMoneyChange))}$
                  </p>
                  <p
                    className={` ${
                      stats?.DayPercentChange.startsWith('-')
                        ? styles.negative
                        : styles.positive
                    }`}
                  >
                    {stats?.DayPercentChange}%
                  </p>
                </div>
              </section>
              <section className={styles.chart}></section>
            </>
          ) : (
            <Lottie
              className={styles.widgetLoading}
              animationData={loadinganimation}
            />
          )}
        </>
      ) : (
        <div className={styles.NoTokens}>
          In this portfolio, there are no assets, <br />
          please add them to see statistics.
        </div>
      )}
    </div>
  );
};

export default Widget;
