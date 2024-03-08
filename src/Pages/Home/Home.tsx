import React from 'react';
import styles from './Home.module.scss';
import Lottie from 'lottie-react';
import animationData2 from '../../animations/Animation - analytics.json';
import animationData from '../../animations/Animation - wallet.json';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.block2}>
        <h1>
          <span className={styles.accent}>Hello, Glad to see you!</span>👋
        </h1>
      </div>

      <div className={styles.first}>
        <div className={styles.block}>
          <p>
            <span className={styles.accent}>Portfolio</span> is made for
            convenient tracking of the value of your crypto assets.
          </p>
        </div>

        <div className={styles.animation}>
          <Lottie animationData={animationData} />
        </div>
      </div>
      <div className={styles.second}>
        <div className={styles.animation}>
          <Lottie animationData={animationData2} />
        </div>
        <div className={styles.block}>
          <p>
            You will be able to easily add new cryptocurrencies, track their
            value in real-time, and analyze price changes.
          </p>
        </div>
      </div>

      <section className={styles.tutorial}>
        <h2 className={styles.accent}>How to start?</h2>
        <div className={styles.block}>
          <p>
            First, create a portfolio. Click on "Portfolio" at the top of the
            page. It's enough to just name it.
          </p>
        </div>
        <img className={styles.photo} src="/img/image 5.png" alt="" />
        <div className={styles.block}>
          <p>Now enter the created portfolio and add cryptocurrency </p>
        </div>
        <div className={styles.SecondBlock}>
          <p>
            You can only add those cryptocurrencies that are listed on the
            Binance exchange
          </p>
        </div>
        <img className={styles.photo} src="/img/image 3.png" alt="" />
        <div className={styles.block}>
          <p>Now you can track the price of your portfolio</p>
        </div>
        <div className={styles.SecondBlock}>
          <p>
            You can also follow each asset of the portfolio separately, for this
            click on the selected asset.
          </p>
        </div>
        <img className={styles.photo} src="/img/image 4.png" alt="" />
        <div className={`${styles.block} ${styles.end}`}>
          <p>Wish you a pleasant use!</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
