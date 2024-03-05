import React from 'react';
import styles from './AddTokenButton.module.scss';
import { useAppDispatch, useAppSelector } from '../../hook';
import { isOpen } from '../../store/OpenPopup';
const AddTokenButton = () => {
  const state = useAppSelector((state) => state.isOpen.isOpen);
  const dispatch = useAppDispatch();
  const handleTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(isOpen(!state));
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(isOpen(!state));
  };
  return (
    <button
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      className={styles.Button}
    >
      Add Token
    </button>
  );
};

export default AddTokenButton;
