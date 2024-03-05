import styles from '../Components/WalletSelection/WalletSelection.module.scss';
const AddIcon = () => {
  return (
    <svg
      className={styles.addIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
    >
      <path
        fill="#282D32"
        d="M11 5H7V1a1 1 0 00-2 0v4H1a1 1 0 000 2h4v4a1 1 0 102 0V7h4a1 1 0 100-2z"
      ></path>
    </svg>
  );
};

export default AddIcon;
