import React from 'react';
import styles from './Asset.module.scss';
import Lottie from 'lottie-react';
import animationData from '../../animations/Animation - LOADING.json';
import { DayChanges, getPriceChange } from '../../BinanceFetch';
import { useAppDispatch, useAppSelector } from '../../hook';
import { isOpenToken } from '../../store/OpenPopup';
import { token } from '../../IndexedDB';
import { formatNumber } from '../../Tools';
type assetData = {
  isloading: boolean;
  tokenName: string;
  price: number;
  quantity: number;
  total: number;
  selectToken: (token: token) => void;
};

const Asset: React.FC<assetData> = (props) => {
  const token = useAppSelector((state) =>
    state.wallet.currentPortfolio.Tokens?.find(
      (el) => el.id === props.tokenName
    )
  );
  const [getingData, setGetingData] = React.useState(true);
  const [changes, setChanges] = React.useState<DayChanges>({
    [props.tokenName]: {
      CurrentPrice: 0,
      PriceChange: 0,
      PercentChange: 0,
    },
  });
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    setGetingData(true);
    if (props.tokenName)
      getPriceChange([props.tokenName]).then((response) => {
        if (response) setChanges(response);
        setGetingData(false);
      });
  }, [props.tokenName]);
  return (
    <div
      onClick={() => {
        if (token) {
          props.selectToken(token);
          dispatch(isOpenToken(true));
        }
      }}
      className={styles.container}
    >
      {!getingData &&
      !props.isloading &&
      props.tokenName &&
      changes[props.tokenName]?.PercentChange ? (
        <>
          <div className={styles.asset}>
            {changes[props.tokenName]?.PercentChange !== undefined ? (
              <div className={styles.name}>
                <p> {props.tokenName}</p>
                <p
                  className={`${
                    changes[props.tokenName]?.PercentChange > 0
                      ? styles.positive
                      : styles.negative
                  }`}
                >
                  {`${changes[props.tokenName]?.PercentChange.toFixed(2)}%`}
                </p>
              </div>
            ) : (
              props.tokenName
            )}
          </div>
          <p className={styles.asset}>{props.price}</p>
          <p className={styles.asset}>{formatNumber(props.quantity)}</p>
          <p className={styles.asset}>{formatNumber(props.total)}</p>
        </>
      ) : (
        <>
          <Lottie className={styles.loading} animationData={animationData} />
          <Lottie className={styles.loading} animationData={animationData} />
          <Lottie className={styles.loading} animationData={animationData} />
          <Lottie className={styles.loading} animationData={animationData} />
        </>
      )}
    </div>
  );
};

export default Asset;
