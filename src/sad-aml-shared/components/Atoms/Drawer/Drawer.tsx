import type { ReactNode } from 'react';
import styles from './Drawer.module.scss';

interface DrawerProps {
  children: ReactNode;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  blurBackground?: boolean;
}

const Drawer = ({
  isDrawerOpen,
  closeDrawer,
  blurBackground = true,
  children,
}: DrawerProps) => {
  return (
    <div>
      <div
        className={`
                    ${styles.drawer} 
                    ${
                      isDrawerOpen
                        ? styles['drawer--show']
                        : styles['drawer--hide']
                    }
                `}
      >
        <div className={styles['drawer__content']}>{children}</div>
      </div>

      {blurBackground && isDrawerOpen ? (
        <div
          className={styles['drawer-blur']}
          onClick={() => closeDrawer()}
        ></div>
      ) : null}
    </div>
  );
};

export default Drawer;
