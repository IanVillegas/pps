import type { ReactNode } from 'react';
import styles from './DashboardLayout.module.scss';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
  title: string;
  /** Icono decorativo a la izquierda del titulo (ej. secciones del wizard). */
  titleIcon?: ReactNode;
  /** Reduce el espacio bajo el titulo cuando le sigue un componente ligado a el (ej. un stepper). */
  compactTitle?: boolean;
}

const DashboardLayout = ({
  children,
  sidebar,
  header,
  title,
  titleIcon,
  compactTitle = false,
}: DashboardLayoutProps) => (
  <div className={styles.wrapper}>
    <a className={styles.skipLink} href="#contenido-principal">
      Saltar al contenido
    </a>
    {sidebar}
    <div className={styles.sideContent}>
      {header}
      <main id="contenido-principal" tabIndex={-1} className={styles.content}>
        <h1 className={compactTitle ? styles.compactTitle : undefined}>
          {titleIcon && (
            <span className={styles.titleIcon} aria-hidden="true">
              {titleIcon}
            </span>
          )}
          {title}
        </h1>
        {children}
      </main>
    </div>
  </div>
);

export default DashboardLayout;
