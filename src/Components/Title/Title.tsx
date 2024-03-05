import React from 'react';
import styles from './Title.module.scss';
import RenameIcon from '../../icons/RenameIcon';
import IndexedDBService, { token } from '../../IndexedDB';
import { useAppDispatch, useAppSelector } from '../../hook';
import {
  changeCurrentPortfolio,
  updatePortfoliosNames,
} from '../../store/walletSlice';

interface title {
  name: string;
  id: string;
  Tokens: token[];
}
const Title: React.FC<title> = (props) => {
  const stateName = useAppSelector(
    (state) => state.wallet.currentPortfolio.name
  );
  const dispatch = useAppDispatch();
  const [title, setTitle] = React.useState(props.name);
  const [changeStatus, setchangeStatus] = React.useState(false);
  const titleRef = React.useRef<HTMLInputElement>(null);

  const handleTouchEnd = (event: React.TouchEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    titleChangeStatusHandle();
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    titleChangeStatusHandle();
  };
  React.useEffect(() => {
    setTitle(props.name);
  }, [props.name]);

  React.useEffect(() => {
    if (!changeStatus) titleRef.current!.disabled = true;
    else {
      titleRef.current!.disabled = false;
      titleRef.current?.focus();
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          titleRef.current?.blur();
        }
      });
    }
  }, [changeStatus]);
  const titleChangeStatusHandle = () => {
    setchangeStatus(true);
  };

  return (
    <>
      <input
        onBlur={() => {
          if (title.length > 0) {
            setchangeStatus(false);

            IndexedDBService.updatePortfolio({
              id: props.id!,
              name: title,
              Tokens: props.Tokens,
            }).then((response) => {
              IndexedDBService.getPortfolio(props.id).then((res) => {
                if (res) {
                  dispatch(changeCurrentPortfolio(res!));
                  dispatch(
                    updatePortfoliosNames({ id: res.id, name: res.name })
                  );
                }
              });
            });
          } else {
            setTitle(stateName);
            setchangeStatus(false);
          }
        }}
        onChange={(event) => setTitle(event.target.value)}
        ref={titleRef}
        type="text"
        maxLength={20}
        className={`${styles.title} ${styles.accent}`}
        value={title}
      />
      <button
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className={styles.rename}
      >
        <RenameIcon />
      </button>
    </>
  );
};

export default Title;
