import React from 'react';
import styles from './SureDelete.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../hook';
import IndexedDBService from '../../IndexedDB';
import { removePortfoliosName } from '../../store/walletSlice';
import animationData from '../../animations/Animation - Accepted.json';
import Lottie from 'lottie-react';
type sureHandle = {
  sureOffHandle: () => void;
};

const SureDeletePortfolio: React.FC<sureHandle> = (props) => {
  const [showAnimation, setShowAnimation] = React.useState(false);
  const PortfolioId = useParams().walletName;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const navigateHandle = (url: string) => {
    if (PortfolioId?.length) {
      const currentPath = window.location.pathname;

      navigate(currentPath.replace(PortfolioId, url));
    }
  };
  const deleting = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setShowAnimation(false);
        resolve(true);
      }, 1500);
    });
  };
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
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
        <p>You are going to delete a portfolio. Are you sure?</p>
        <div className={styles.choise}>
          <button
            onClick={() => {
              props.sureOffHandle();
            }}
          >
            No
          </button>
          <button
            onClick={() => {
              if (PortfolioId) {
                IndexedDBService.deletePortfolio(PortfolioId).then((res) => {
                  IndexedDBService.getAllPortfoliosName().then((res2) => {
                    setShowAnimation(true);
                    deleting().then((res3) => {
                      dispatch(removePortfoliosName(PortfolioId));
                      if (res2.length) {
                        props.sureOffHandle();
                        navigateHandle(res2[0].id);
                      } else {
                        props.sureOffHandle();
                        navigate(`/home`);
                      }
                    });
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

export default SureDeletePortfolio;
