'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
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
  items: SideBarItem[];
  label?: string;
}

const SideBar = ({
  logo,
  items,
  label = 'Navegación principal',
}: SideBarProps) => (
  <aside className={styles.sideBar}>
    <div className={styles.sideBar__logo}>{logo}</div>
    <nav aria-label={label} className={styles.sideBar__navigation}>
      <ul>
        {items.map(item => (
          <li key={item.id} className={item.active ? styles.active : undefined}>
            {/* Visibilidad la decide el CSS (activo o hover del enlace),
                no JS: por eso el icono siempre se renderiza. */}
            <span className={styles.sideBar__arrow} aria-hidden="true">
              <i className="ri-arrow-right-line" />
            </span>
            {item.href ? (
              <Link
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <button type="button" disabled title="No disponible">
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default SideBar;
