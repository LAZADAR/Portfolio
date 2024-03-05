import React from 'react';
import styles from './AddTokenPopup.module.scss';
import buttonStyles from './AddTokenButton.module.scss';
import tokenlistStyles from './TokenList.module.scss';
import IndexedDBService, { transaction } from '../../IndexedDB';
import TokenList from './TokenList';
import { getSpotPriceForPair } from '../../BinanceFetch';
import { useAppDispatch, useAppSelector } from '../../hook';
import { isOpen } from '../../store/OpenPopup';
import { addTokenInPortfolio } from '../../store/walletSlice';
import rejectedAnimation from '../../animations/Animation - Rejected.json';
import acceptedAnimation from '../../animations/Animation - Accepted.json';
import Lottie from 'lottie-react';
import CloseIcon from '../../icons/CloseIcon';
type tokenState = {
  id?: string;
  buyPrice?: number;
  quantity?: number;
  transactions?: transaction[];
};
type popupProp = {
  PopupId: string;
};
const AddTokenPopup: React.FC<popupProp> = (props) => {
  const tokenlist = useAppSelector((state) => state.binanceTokens.tokenList);
  const dispatch = useAppDispatch();
  const [tokenInfo, setTokenInfo] = React.useState<tokenState>({
    id: '',
    quantity: 0,
    buyPrice: undefined,
  });
  const [showPopup, setShowPopup] = React.useState(true);
  const [inUSDT, setInUSDT] = React.useState<string>();
  const [quantityValue, setquantityValue] = React.useState<string>();
  const [priceValue, setpriceValue] = React.useState<string>();
  const PopupRef = React.useRef(null);
  const getPrice = async (value: string) => {
    if (value) {
      return getSpotPriceForPair(value);
    }
  };
  const Resize = () => {
    if (window.innerHeight > 450) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };
  const unfocusHandle = (value: boolean) => {
    !value && setShowPopup(false);
  };
  const selectIDHandle = async (value: string) => {
    setTokenInfo((prev) => (prev = { ...prev, id: value }));
    setShowPopup(false);
    const price = await getPrice(value);
    if (price !== null)
      setTokenInfo((prev) => (prev = { ...prev, buyPrice: price! }));
    setpriceValue(price?.toString());
  };
  const [submitResult, setSubmitResult] = React.useState(true);
  const [showResult, setShowResult] = React.useState(false);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    value = value.replace(/[^\d.]/g, '');
    if (value === '.') value = '0.';

    const dotIndex = value.indexOf('.');
    if (dotIndex !== -1) {
      value =
        value.slice(0, dotIndex + 1) +
        value.slice(dotIndex + 1).replace(/\./g, '');
    }

    if (value.startsWith('0')) {
      value = '0.' + value.slice(2);
    } else {
      value = value.replace(/^0+/, '');
    }
    setpriceValue(value);

    setTokenInfo((prev) => ({ ...prev, buyPrice: parseFloat(value) }));
  };
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    value = value.replace(/[^\d.]/g, '');
    if (value === '.') value = '0.';

    const dotIndex = value.indexOf('.');
    if (dotIndex !== -1) {
      value =
        value.slice(0, dotIndex + 1) +
        value.slice(dotIndex + 1).replace(/\./g, '');
    }

    if (value.startsWith('0')) {
      value = '0.' + value.slice(2);
    } else {
      value = value.replace(/^0+/, '');
    }
    setquantityValue(value);

    setTokenInfo((prev) => ({ ...prev, quantity: parseFloat(value) }));

    if (priceValue) {
      const quantity = parseFloat(value.replace(',', '.'));
      const USDT = quantity * parseFloat(priceValue);

      setInUSDT(USDT.toFixed(2).toString());
    }
  };
  const handleInUSDTChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    value = value.replace(/[^\d.]/g, '');
    if (value === '.') value = '0.';

    const dotIndex = value.indexOf('.');
    if (dotIndex !== -1) {
      value =
        value.slice(0, dotIndex + 1) +
        value.slice(dotIndex + 1).replace(/\./g, '');
    }

    if (value.startsWith('0')) {
      value = '0.' + value.slice(2);
    } else {
      value = value.replace(/^0+/, '');
    }

    setInUSDT(value);
    if (priceValue && value) {
      const quantity = parseFloat(value) / parseFloat(priceValue);

      setTokenInfo((prev) => ({
        ...prev,
        quantity: parseFloat(quantity.toFixed(2)),
      }));
      setquantityValue(quantity.toFixed(2).toString());
    }
  };
  const handleKeyDownPrice = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Якщо натиснута клавіша Backspace і значення інпуту починається з "0.",
    // можна видалити цей "0."
    if (priceValue)
      if (
        event.key === 'Backspace' &&
        priceValue.startsWith('0.') &&
        priceValue.length === 2
      ) {
        setpriceValue(priceValue.slice(1));
      }
  };
  const handleKeyDownInUSDT = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (inUSDT)
      if (
        event.key === 'Backspace' &&
        inUSDT.startsWith('0.') &&
        inUSDT.length === 2
      ) {
        setInUSDT(inUSDT.slice(1));
      }
  };
  const handleKeyDownQuantity = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (quantityValue)
      if (
        event.key === 'Backspace' &&
        quantityValue.startsWith('0.') &&
        quantityValue.length === 2
      ) {
        setquantityValue(quantityValue.slice(1));
      }
  };
  React.useEffect(() => {
    if (quantityValue)
      if (priceValue) {
        const quantity = parseFloat(quantityValue);
        const USDT = quantity * parseFloat(priceValue);
        setInUSDT(USDT.toFixed(2).toString());
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceValue]);
  React.useEffect(() => {
    Resize();
    const clickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest(`.${styles.popup}`) &&
        !target.closest(`.${buttonStyles.Button}`) &&
        !target.closest(`.${tokenlistStyles.container}`)
      )
        dispatch(isOpen(false));
    };
    window.addEventListener('resize', Resize);
    document.addEventListener('click', clickOutside);
    return () => {
      window.removeEventListener('resize', Resize);
      document.body.style.overflow = 'auto';
      document.removeEventListener('click', clickOutside);
    };
  }, []);
  const handleTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(isOpen(false));
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(isOpen(false));
  };
  return (
    <div className={styles.container}>
      <form ref={PopupRef} className={styles.popup}>
        <button
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
          className={styles.close}
        >
          <CloseIcon />
        </button>
        <label htmlFor="tokenInput">Token</label>
        <input
          autoComplete="off"
          maxLength={20}
          id="tokenInput"
          onFocus={() => setShowPopup(true)}
          value={tokenInfo?.id}
          onChange={(event) => {
            setTokenInfo({ id: event.target.value.toUpperCase() });
            if (tokenInfo?.id) {
            }
          }}
          type="text"
        />

        {showPopup && (
          <TokenList
            unfocusHandle={unfocusHandle}
            selected={selectIDHandle}
            tokenName={tokenInfo?.id}
          />
        )}
        <label htmlFor="priceInput">Price</label>
        <input
          id="priceInput"
          autoComplete="off"
          maxLength={10}
          onKeyDown={handleKeyDownPrice}
          onChange={handlePriceChange}
          value={priceValue}
          type="text"
          inputMode="numeric"
        />

        <div className={styles.Quantity}>
          <div className={styles.TokenBlock}>
            <label htmlFor="quantityInput">Quantity</label>
            <input
              id="quantityInput"
              autoComplete="off"
              onKeyDown={handleKeyDownQuantity}
              value={quantityValue}
              onChange={handleQuantityChange}
              type="text"
              inputMode="numeric"
            />
          </div>
          <div className={styles.inUSDTBlock}>
            <label htmlFor="inUSDTInput">In USDT</label>
            <input
              id="inUSDTInput"
              autoComplete="off"
              onKeyDown={handleKeyDownInUSDT}
              onChange={handleInUSDTChange}
              value={inUSDT}
              type="text"
              inputMode="numeric"
            />
          </div>
        </div>

        <button
          onClick={async (event) => {
            event.preventDefault();
            console.log('FIRST ZONE');
            console.log(submitResult);

            if (tokenInfo.buyPrice && tokenInfo.id && tokenInfo.quantity) {
              setSubmitResult(true);
              console.log('SECOND ZONE');
              console.log(submitResult);
              if (tokenlist.includes(tokenInfo.id)) {
                setSubmitResult(true);
                console.log('Third ZONE');
                console.log(submitResult);

                await IndexedDBService.AddToken(props.PopupId, {
                  id: tokenInfo.id!,
                  buyPrice: tokenInfo.buyPrice!,
                  quantity: tokenInfo.quantity!,
                  changes: {
                    DayPercent: 0,
                    DayPrice: 0,
                  },
                  currentPrice: 0,
                  transactions: [],
                });

                dispatch(
                  addTokenInPortfolio({
                    Token: {
                      id: tokenInfo.id!,
                      changes: {
                        DayPercent: 0,
                        DayPrice: 0,
                      },
                      currentPrice: 0,
                      buyPrice: tokenInfo.buyPrice!,
                      quantity: tokenInfo.quantity!,
                      transactions: [],
                    },
                  })
                );

                setTimeout(() => setShowResult(true), 0);
                setTimeout(() => dispatch(isOpen(false)), 1500);
              } else {
                console.log('ELSE ZONE');
                setSubmitResult(false);
                console.log(submitResult);
                setTimeout(() => setShowResult(true), 0);
                setTimeout(() => setShowResult(false), 2000);
              }
            } else {
              setSubmitResult(false);
              setTimeout(() => setShowResult(true), 0);
              setTimeout(() => setShowResult(false), 2000);
              setInUSDT('');
              setpriceValue('');
              setquantityValue('');
            }
          }}
          className={styles.Buy}
        >
          {showResult
            ? (!submitResult && (
                <Lottie
                  className={styles.submitanimation}
                  animationData={rejectedAnimation}
                />
              )) || (
                <Lottie
                  className={styles.submitanimation}
                  animationData={acceptedAnimation}
                />
              )
            : 'Buy'}
        </button>
      </form>
    </div>
  );
};

export default AddTokenPopup;
