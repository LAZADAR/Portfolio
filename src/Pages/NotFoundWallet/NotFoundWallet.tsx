import Lottie from 'lottie-react';
import React from 'react';
import styles from './NotFoundWallet.module.scss';
import animationData from '../../animations/Animation - 1708079148525.json';
const NotFoundWallet = () => {
  return (
    <div className={styles.container}>
      <h1>
        Not found a Wallet, Try to choose correct wallet or create a new one
      </h1>
    </div>
  );
};

export default NotFoundWallet;
