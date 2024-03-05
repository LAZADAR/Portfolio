import React from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import animationData from '../../animations/Animation - 1708020092683.json';
import styles from './NotFount.module.scss';
import { NavLink } from 'react-router-dom';
const NotFound = () => {
  const animationRef = React.useRef<LottieRefCurrentProps>(null);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.text}>
          <NavLink className={styles.toHome} to="/home">
            Home
          </NavLink>
        </div>
        <Lottie
          onComplete={() => {}}
          lottieRef={animationRef}
          animationData={animationData}
        />
      </div>
    </div>
  );
};

export default NotFound;
