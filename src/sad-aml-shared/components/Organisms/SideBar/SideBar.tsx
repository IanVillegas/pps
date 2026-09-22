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
  items: SideBarItem[];
  label?: string;
  /** Colapsado a una franja de solo iconos. Por defecto expandido. */
  collapsed?: boolean;
  /** Si se omite, no se renderiza el boton de colapsar/expandir. */
  onToggleCollapse?: () => void;
}

const SideBar = ({
  logo,
  items,
  label = 'Navegación principal',
  collapsed = false,
  onToggleCollapse,
}: SideBarProps) => (
  <aside
    className={`${styles.sideBar} ${collapsed ? styles['sideBar--collapsed'] : ''}`}
  >
    {/* Sin logo al colapsar: no hay un simbolo "M" suelto exportado de
        Figma, y recortar el wordmark completo a mano seria inventar un
        asset que el diseno no define. */}
    {!collapsed && <div className={styles.sideBar__logo}>{logo}</div>}
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
          // El texto no se quita del DOM al colapsar (queda visualmente
          // oculto, `sideBar__labelHidden`): sigue siendo el nombre
          // accesible del enlace/boton para lectores de pantalla, y el
          // Tooltip cubre el caso visual con mouse/teclado. `sideBar__icon`
          // y `sideBar__label` (siempre presentes) evitan que el `span {
          // font-size: 20px }` pensado para el icono, y el reset global
          // `p, span { font-family: poppins }` de globals.scss, le peguen
          // tambien al texto visible (bug real: quedaba en Poppins 20px en
          // vez de Work Sans 14px heredado del enlace).
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
              {/* Visibilidad la decide el CSS (activo o hover del enlace),
                  no JS: por eso el icono siempre se renderiza. Se omite del
                  todo al colapsar: no hay espacio para ella en la franja. */}
              {!collapsed && (
                <span className={styles.sideBar__arrow} aria-hidden="true">
                  <i className="ri-arrow-right-line" />
                </span>
              )}
              {/* Un boton deshabilitado no dispara el Tooltip (eventos de
                  puntero/foco no llegan a elementos disabled); conserva su
                  `title` nativo, que si funciona ahi. */}
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
