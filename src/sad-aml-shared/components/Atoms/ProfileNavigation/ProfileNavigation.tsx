'use client';

import type { ReactNode } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styles from './ProfileNavigation.module.scss';

interface ProfileNavigationProps {
  profileHref?: string;
  settingsHref?: string;
  logOutAction: () => void;
  icon?: ReactNode;
  logoutIcon?: ReactNode;
}

const ProfileNavigation = ({
  logOutAction,
  icon,
  logoutIcon,
}: ProfileNavigationProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <button
        type="button"
        className={styles.wrapperTrigger}
        aria-label="Menú de usuario"
        title="Menú de usuario"
      >
        <span className={styles.wrapperTrigger__icon}>
          {icon ?? <i className="ri-user-line" aria-hidden="true" />}
        </span>
        <i className="ri-arrow-down-s-line" aria-hidden="true" />
      </button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={styles.wrapperContent}
        align="end"
        sideOffset={12}
        collisionPadding={16}
      >
        <DropdownMenu.Item
          className={styles.wrapperContent__item}
          onSelect={logOutAction}
        >
          {logoutIcon ?? (
            <i className="ri-logout-circle-r-line" aria-hidden="true" />
          )}
          Cerrar sesión
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default ProfileNavigation;
