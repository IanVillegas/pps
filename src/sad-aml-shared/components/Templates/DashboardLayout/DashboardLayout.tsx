import type { ReactNode } from 'react';
import styles from '@/sad-aml-shared/components/Templates/DashboardLayout/DashboardLayout.module.scss';
import { SideBar, Header } from '@/sad-aml-shared/components/Organisms';
import useDrawer from '@/sad-aml-shared/utils/hooks/useDrawer';

interface DashboardLayoutProps {
  children: ReactNode;
}

const handleLogout = () => {};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isDrawerOpen, openDrawer, closeDrawer } = useDrawer();

  return (
    <div className={styles.wrapper}>
      <SideBar
        isDrawerOpen={isDrawerOpen}
        openDrawer={openDrawer}
        closeDrawer={closeDrawer}
        handleLogout={handleLogout}
      />
      <div className={styles.sideContent}>
        <Header handleLogout={handleLogout} openDrawer={openDrawer} />
        <div className={styles.content}>{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default DashboardLayout;
