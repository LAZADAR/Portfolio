import React from 'react';
import styles from '../Components/WalletSelection/WalletSelection.module.scss';
const SelectIcon = () => {
  return (
    <svg
      className={styles.selectIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="10"
      fill="none"
      viewBox="0 0 17 10"
    >
      <path
        fill="#0C1821"
        d="M8.5 6.957L2.065.363A1.179 1.179 0 00.348.379c-.47.5-.463 1.302.016 1.793l7.285 7.465c.473.484 1.23.484 1.702 0l7.285-7.465c.479-.49.486-1.293.016-1.793a1.179 1.179 0 00-1.717-.016L8.5 6.957z"
      ></path>
    </svg>
  );
};

export default SelectIcon;
