'use client';

import type { ReactElement, ReactNode } from 'react';
import Link from 'next/link';
import Tooltip from '@/sad-aml-shared/components/Atoms/Tooltip/Tooltip';
import styles from './SideBar.module.scss';

export interface SideBarItem {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  active?: boolean;
}

interface SideBarProps {
  logo: ReactNode;
  collapsedLogo: ReactNode;
  items: SideBarItem[];
  label?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SideBar = ({
  logo,
  collapsedLogo,
  items,
  label = 'Navegación principal',
  collapsed = false,
  onToggleCollapse,
}: SideBarProps) => (
  <aside
    className={`${styles.sideBar} ${collapsed ? styles['sideBar--collapsed'] : ''}`}
  >
    {(!collapsed || collapsedLogo) && (
      <div
        className={`${styles.sideBar__logo} ${collapsed ? styles['sideBar__logo--collapsed'] : ''}`}
      >
        {collapsed ? collapsedLogo : logo}
      </div>
    )}
    {onToggleCollapse && (
      <button
        type="button"
        className={styles.sideBar__toggle}
        onClick={onToggleCollapse}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        <i
          className={collapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'}
          aria-hidden="true"
        />
      </button>
    )}
    <nav aria-label={label} className={styles.sideBar__navigation}>
      <ul>
        {items.map(item => {
          const labelClassName = [
            styles.sideBar__label,
            collapsed ? styles.sideBar__labelHidden : '',
          ]
            .filter(Boolean)
            .join(' ');
          const control: ReactElement = item.href ? (
            <Link
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
            >
              <span className={styles.sideBar__icon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={labelClassName}>{item.label}</span>
            </Link>
          ) : (
            <button type="button" disabled title="No disponible">
              <span className={styles.sideBar__icon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={labelClassName}>{item.label}</span>
            </button>
          );

          return (
            <li
              key={item.id}
              className={item.active ? styles.active : undefined}
            >
              {!collapsed && (
                <span className={styles.sideBar__arrow} aria-hidden="true">
                  <i className="ri-arrow-right-line" />
                </span>
              )}
              {collapsed && item.href ? (
                <Tooltip content={item.label} side="right">
                  {control}
                </Tooltip>
              ) : (
                control
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  </aside>
);

export default SideBar;
