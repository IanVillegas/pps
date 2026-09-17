import type { ReactNode } from 'react';
import styles from './DashboardLayout.module.scss';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
  title: string;
}

const DashboardLayout = ({
  children,
  sidebar,
  header,
  title,
}: DashboardLayoutProps) => (
  <div className={styles.wrapper}>
    <a className={styles.skipLink} href="#contenido-principal">
      Saltar al contenido
    </a>
    {sidebar}
    <div className={styles.sideContent}>
      {header}
      <main id="contenido-principal" tabIndex={-1} className={styles.content}>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  </div>
);

export default DashboardLayout;
