import React, { Children } from 'react';
import styles from './TokenList.module.scss';
import { useAppSelector } from '../../hook';
type filteredList = {
  tokenName: string | undefined;
  selected: (value: string) => void;
  unfocusHandle: (value: boolean) => void;
};
const TokenList: React.FC<filteredList> = (props) => {
  const [filteredList, setFilteredList] = React.useState<string[]>([]);
  const tokens = useAppSelector((state) => state.binanceTokens.tokenList);
  React.useEffect(() => {
    if (props.tokenName)
      setFilteredList(
        tokens.filter((token) => token.includes(props.tokenName!)).slice(0, 4)
      );
    const handleClickOutside = (event: MouseEvent) => {
      const node = event.target as Node;
      const container = document.querySelector(`.${styles.container}`);
      if (container && !container.contains(node)) {
        props.unfocusHandle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [props.tokenName, tokens]);

  return (
    <div
      className={`${styles.container} ${
        filteredList.length === 0 && styles.hide
      }`}
    >
      <div className={styles.content}>
        {filteredList.map((token) => (
          <div
            key={token}
            onClick={(event) => props.selected(token)}
            className={styles.token}
          >
            {token}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;
