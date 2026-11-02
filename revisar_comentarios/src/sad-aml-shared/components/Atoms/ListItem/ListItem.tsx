'use client';

import React, { useState } from 'react';
import styles from './ListItem.module.scss';

interface ListItemProps {
  active?: boolean;
  href?: string;
  icon: React.JSX.Element;
  label: string;
  asButton?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const ListItem = ({
  active,
  href,
  icon,
  label,
  asButton,
  onClick,
  isCollapsed,
}: ListItemProps) => {
  const [isActive, setIsActive] = useState(active);
  return asButton ? (
    <div
      className={styles.listItem}
      onMouseOver={_e => setIsActive(true)}
      onMouseLeave={_e => setIsActive(false)}
    >
      {isActive || active ? (
        <span className={styles.listItem__arrow}>
          <i className="ri-arrow-right-line"></i>
        </span>
      ) : null}
      <button
        onClick={() => {
          if (onClick) onClick();
        }}
        className={`${styles.link} ${isActive || active ? styles.active : ''}`}
      >
        <span className={styles.link__icon}>{icon}</span>
        {isCollapsed ? null : label}
      </button>
    </div>
  ) : (
    <div
      className={styles.listItem}
      onMouseOver={_e => setIsActive(true)}
      onMouseLeave={_e => setIsActive(false)}
    >
      <a
        href={href || ''}
        className={`${styles.link} ${
          isActive || active ? styles.active : ''
        } ${isCollapsed ? styles.isCollapsed : ''}`}
      >
        <span className={styles.link__icon}>{icon}</span>
        {label}
      </a>
    </div>
  );
};

ListItem.defaultProps = {
  active: false,
  asButton: false,
};

export default ListItem;
