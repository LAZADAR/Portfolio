import React from 'react';
import styles from './TokenPopup.module.scss';
import { useAppDispatch, useAppSelector } from '../../hook';
import { changeCurrentPortfolio, removeToken } from '../../store/walletSlice';
import IndexedDBService, { token } from '../../IndexedDB';
import { isOpenToken } from '../../store/OpenPopup';
import Lottie from 'lottie-react';
import animationStyles from '../AddToken/AddTokenButton.module.scss';
import animationData from '../../animations/Animation - Accepted.json';
interface SureFN {
  sureHandle: () => void;
  token: token;
}

const Sure: React.FC<SureFN> = (props) => {
  const dispatch = useAppDispatch();
  const [showAnimation, setShowAnimation] = React.useState(false);
  const portfolio = useAppSelector((state) => state.wallet.currentPortfolio);

  const deleting = async () => {
    setShowAnimation(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setShowAnimation(false);
        resolve(true);
      }, 1500);
    });
  };

  return (
    <div className={styles.sure}>
      <div className={styles.sureBlock}>
        {showAnimation && (
          <div className={`${styles.animationblock}`}>
            <Lottie
              loop={false}
              className={styles.deleteanimation}
              animationData={animationData}
            />
          </div>
        )}
        <p>Are you sure?</p>
        <div className={styles.choise}>
          <button onClick={() => props.sureHandle()}>No</button>
          <button
            onClick={() => {
              const index = portfolio.Tokens?.findIndex(
                (el) => el.id === props.token.id
              );

              if (index !== undefined && index >= 0) {
                const TokenArr = [...portfolio.Tokens!];
                TokenArr?.splice(index, 1);

                IndexedDBService.updatePortfolio({
                  ...portfolio,
                  Tokens: TokenArr,
                }).then((response) => {
                  deleting().then((res) => {
                    dispatch(
                      changeCurrentPortfolio({
                        ...portfolio,
                        Tokens: TokenArr,
                      })
                    );
                    props.sureHandle();
                    dispatch(isOpenToken(false));
                  });
                });
              }
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sure;
