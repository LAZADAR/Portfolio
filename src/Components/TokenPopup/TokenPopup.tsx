import React from 'react';
import styles from './TokenPopup.module.scss';
import { token } from '../../IndexedDB';
import assetStyles from '../Asset/Asset.module.scss';
import { isOpen, isOpenToken } from '../../store/OpenPopup';
import { useAppDispatch } from '../../hook';
import Sure from './Sure';
import { formatNumber } from '../../Tools';
import CloseIcon from '../../icons/CloseIcon';
interface tokeninfo {
  tokenInfo: token;
}
const TokenPopup: React.FC<tokeninfo> = (props) => {
  const [sure, SetSure] = React.useState(false);
  const dispatch = useAppDispatch();
  const getDate = (date: number): string => {
    const dateObj = new Date(date);
    let month: number | string = dateObj.getMonth() + 1;
    const day = dateObj.getDate().toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hour = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');

    return `${day}.${month}.${year} | ${hour}:${minutes}:${seconds}`;
  };

  const Resize = () => {
    if (window.innerHeight > 500) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(isOpenToken(false));
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(isOpenToken(false));
  };
  let isyesterday: boolean | undefined;
  if (props.tokenInfo.transactions) {
    const yesterday = props.tokenInfo.transactions.findIndex(
      (transaction) => transaction.date < Date.now() - 86400000
    );

    isyesterday = yesterday >= 0;
  }
  const sureHandle = () => {
    SetSure(false);
  };

  const TotalPortfolioChange =
    props.tokenInfo.currentPrice * props.tokenInfo.quantity -
    props.tokenInfo.buyPrice * props.tokenInfo.quantity;

  React.useEffect(() => {
    Resize();
    const clickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest(`.${styles.popup}`) &&
        !target.closest(`.${assetStyles.container}`) &&
        !target.closest(`.${styles.sure}`)
      )
        dispatch(isOpenToken(false));
    };
    window.addEventListener('resize', Resize);
    document.addEventListener('click', clickOutside);
    return () => {
      window.removeEventListener('resize', Resize);
      document.body.style.overflow = 'auto';
      document.removeEventListener('click', clickOutside);
    };
  }, []);

  const StartPrice = props.tokenInfo.transactions.reduce(
    (acc, el) => acc + el.price * el.quantity,
    0
  );
  return (
    <div className={styles.container}>
      <div className={styles.popup}>
        {sure && <Sure token={props.tokenInfo} sureHandle={sureHandle} />}
        <button
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
          className={styles.close}
        >
          <CloseIcon />
        </button>
        <section className={styles.top}>
          <div className={styles.mainInfo}>
            <h1>
              {props.tokenInfo.id.substring(0, props.tokenInfo.id.length - 4)}
            </h1>
            <div className={styles.mainInfoBlock}>
              <h2>${formatNumber(props.tokenInfo.currentPrice)}</h2>
              <p
                className={
                  props.tokenInfo.changes.DayPercent > 0
                    ? styles.positive
                    : styles.negative
                }
              >
                {props.tokenInfo.changes.DayPercent > 0
                  ? `+${props.tokenInfo.changes.DayPercent.toFixed(2)} %`
                  : `${props.tokenInfo.changes.DayPercent.toFixed(2)} %`}
              </p>
            </div>
          </div>
          <div className={styles.costInfo}>
            <div className={styles.total}>
              <p>Balance:</p>

              <h2>
                {`${formatNumber(
                  props.tokenInfo.quantity
                )} ${props.tokenInfo.id.substring(
                  0,
                  props.tokenInfo.id.length - 4
                )}`}
              </h2>
              <p className={styles.balanceInUsdt}>
                ≈ $
                {formatNumber(
                  props.tokenInfo.currentPrice * props.tokenInfo.quantity
                )}
              </p>
            </div>
            <div className={styles.changes}>
              <p>Profit:</p>
              <h2
                className={`${
                  TotalPortfolioChange > 0 ? styles.positive : styles.negative
                }`}
              >
                ${formatNumber(TotalPortfolioChange)}
              </h2>
              <p
                className={
                  TotalPortfolioChange > 0 ? styles.positive : styles.negative
                }
              >
                {TotalPortfolioChange > 0
                  ? `+${formatNumber(
                      (TotalPortfolioChange / StartPrice) * 100
                    )}%`
                  : `${
                      isyesterday
                        ? formatNumber(props.tokenInfo.changes.DayPrice)
                        : formatNumber(
                            props.tokenInfo.currentPrice -
                              props.tokenInfo.buyPrice
                          )
                    }%`}
              </p>
            </div>
          </div>
        </section>
        <p style={{ fontWeight: '600', marginTop: '10px' }}>History:</p>
        <section className={styles.transactions}>
          <p>Date</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
        </section>
        <section className={styles.transactionsContent}>
          {props.tokenInfo.transactions.map((element) => {
            return (
              <div
                key={element.date}
                className={styles.transactionDataContainer}
              >
                <p className={styles.transactionData}>
                  {getDate(element.date)}
                </p>
                <p className={styles.transactionData}>{element.price}</p>
                <p className={styles.transactionData}>
                  {formatNumber(element.quantity)}
                </p>
                <p className={styles.transactionData}>
                  {formatNumber(element.quantity * element.price)}
                </p>
              </div>
            );
          })}
        </section>
        <button onClick={() => SetSure(true)} className={styles.deleteButton}>
          Delete token
        </button>
      </div>
    </div>
  );
};

export default TokenPopup;
