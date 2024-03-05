import React from 'react';
import styles from '../AddToken/AddTokenButton.module.scss';

import SureDeletePortfolio from './SureDeletePortfolio';

const DeletePortfolio = () => {
  const [sure, setSure] = React.useState(false);
  const sureOffHandle = () => {
    setSure(false);
    document.body.classList.remove('LockScroll');
  };
  const handleTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    document.body.classList.add('LockScroll');
    setSure(true);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    document.body.classList.add('LockScroll');
    setSure(true);
  };
  return (
    <>
      {sure && <SureDeletePortfolio sureOffHandle={sureOffHandle} />}
      <button
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className={styles.Button}
      >
        Delete Portfolio
      </button>
    </>
  );
};

export default DeletePortfolio;
