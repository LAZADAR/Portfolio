import React from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import WalletSelection from '../../Components/WalletSelection/WalletSelection';
import styles from './Layout.module.scss';
const Layout: React.FC = () => {
  return (
    <div className={styles.container}>
      <header>
        <WalletSelection />
        <NavLink className={styles.toHome} to="/home">
          Guide
        </NavLink>
      </header>
      <Outlet />
    </div>
  );
};

export default Layout;
