import React from 'react';
import styles from './WalletSelection.module.scss';
import SelectIcon from '../../icons/SelectIcon';
import SelectionMenu from './SelectionMenu/SelectionMenu';
import { getAllSpotTradingPairsToUSDT } from '../../BinanceFetch';
import { UpdateTokens } from '../../store/BinanceTokensSlice';
import { useAppDispatch } from '../../hook';
import { ActualizePortfolios } from '../../Tools';
const WalletSelection = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  const closeHandle = () => {
    if (isOpen) setIsOpen(false);
  };
  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    setIsOpen((prev) => !prev);
  };
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    setIsOpen((prev) => !prev);
  };

  React.useEffect(() => {
    async function get() {
      await ActualizePortfolios(dispatch);
    }
    get();
    const fetchCryptoList = async () => {
      const list = await getAllSpotTradingPairsToUSDT();
      dispatch(UpdateTokens(list));
    };
    fetchCryptoList();
  }, []);

  return (
    <>
      <div
        ref={selectRef}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className={`${styles.selection} ${isOpen && styles.reversed}`}
      >
        Portfolio
        <SelectIcon />
      </div>
      {isOpen && (
        <SelectionMenu
          selectRef={selectRef}
          show={isOpen}
          close={closeHandle}
        />
      )}
    </>
  );
};

export default WalletSelection;
