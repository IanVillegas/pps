'use client';

import type { ReactNode } from 'react';
import ProfileNavigation from '../../Atoms/ProfileNavigation/ProfileNavigation';
import styles from './Header.module.scss';

interface HeaderProps {
  clientName: string;
  handleLogout: () => void;
  children?: ReactNode;
  profileIcon?: ReactNode;
  logoutIcon?: ReactNode;
}

const Header = ({
  clientName,
  handleLogout,
  children,
  profileIcon,
  logoutIcon,
}: HeaderProps) => (
  <header className={styles.header}>
    {children}
    <div className={styles.header__profile}>
      <div className={styles.header__name}>
        <strong>Hola,</strong>
        <span>{clientName}</span>
      </div>
      <ProfileNavigation
        logOutAction={handleLogout}
        icon={profileIcon}
        logoutIcon={logoutIcon}
      />
    </div>
  </header>
);

export default Header;
