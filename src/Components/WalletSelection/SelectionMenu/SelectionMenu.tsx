import React from 'react';
import styles from './SelectionMenu.module.scss';
import AddIcon from '../../../icons/AddIcon';
import { useAppSelector, useAppDispatch } from '../../../hook';
import { NavLink } from 'react-router-dom';
import IndexedDBService from '../../../IndexedDB';
import { ActualizePortfolios } from '../../../Tools';

type show = {
  show: boolean;
  close: Function;
  selectRef: React.RefObject<HTMLDivElement>;
};
const SelectionMenu: React.FC<show> = (props) => {
  const [addStatus, setAddStatus] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const menuRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wallets = useAppSelector((state) => state.wallet.walletList);
  const dispatch = useAppDispatch();
  const handleTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    addWalletHandle();
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addWalletHandle();
  };
  const addWalletHandle = async () => {
    if (!addStatus) {
      setTimeout(() => inputRef.current!.focus(), 0);
    }

    setAddStatus(true);
    if (title.trim().length > 0) {
      const id = 'id' + new Date().getTime();
      await IndexedDBService.addPortfolio(title, id);
      setTitle('');
      setAddStatus(false);
      await ActualizePortfolios(dispatch);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addWalletHandle();
    }
  };
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuRef.current !== event.target &&
        !menuRef.current.closest(styles.SelectionMenu) &&
        !props.selectRef.current?.contains(event.target as Node)
      ) {
        props.close();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') props.close();
    });

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  return (
    <div
      ref={menuRef}
      className={`${styles.popup} ${props.show && styles.show}`}
    >
      <div className={styles.content}>
        {wallets.length ? (
          wallets.map((wallet) => (
            <NavLink
              key={wallet.id}
              onClick={() => {
                props.close();
              }}
              to={`portfolio/${wallet.id.trim()}`}
            >{`${wallet.name}`}</NavLink>
          ))
        ) : (
          <p className={styles.noData}>You don't have any portfolios</p>
        )}
      </div>
      <div className={styles.add}>
        <input
          ref={inputRef}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={handleKeyDown}
          value={title}
          placeholder="Type a title"
          className={`${styles.name} ${!addStatus && styles.hide}`}
          type="text"
        />
        <button
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
          className={`${styles.addButton} ${addStatus && styles.moveRight}`}
        >
          <AddIcon />
        </button>
      </div>
    </div>
  );
};

export default SelectionMenu;
