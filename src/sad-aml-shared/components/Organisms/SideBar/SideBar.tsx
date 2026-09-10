import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, ListItem, Picture, LastAccess } from '../../Atoms';
import { SideMenuList } from '@/sad-aml-shared/components/Molecules';
import styles from '@/sad-aml-shared/components/Organisms/SideBar/SideBar.module.scss';
import LogoAndLetters from '@/sad-aml-shared/assets/images/logo-orange-with-black-letters.svg';
import Logo from '@/sad-aml-shared/assets/images/logo_only.png';

export enum enumMf {
  MY_PRODUCTS = '/mis-productos',
  SEND_CASH = '/enviar-dinero',
  PAY = '/pagar',
  BRING_CASH = '/traer-dinero',
  VOUCHERS = '/comprobantes',
  REQUEST = '/solicitudes',
  CONFIG = '/configuracion',
  PROFILE = '/perfil',
  PAYMENTS = '/payments',
}

interface SideBarProps {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  handleLogout: () => void;
}

const SideBar = ({
  isDrawerOpen,
  openDrawer,
  closeDrawer,
  handleLogout,
}: SideBarProps) => {
  //const clientName = useSelector((state: any) => state.login.clientName)
  const router = useRouter();
  const [t] = useTranslation('global');
  const [isCollapsed, setIsCollapsed] = useState(false); // ✅ Nuevo estado

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const items = [
    {
      id: 1,
      icon: <i className="ri-home-line"></i>,
      label: 'Home',
      href: enumMf.MY_PRODUCTS,
      active: router.basePath === enumMf.MY_PRODUCTS,
    },
    {
      id: 2,
      icon: <i className="ri-money-dollar-circle-line"></i>,
      label: 'Pagos y Consultas',
      href: enumMf.PAYMENTS,
      active: router.basePath === enumMf.PAYMENTS,
    },
    {
      id: 3,
      icon: <i className="ri-exchange-dollar-line"></i>,
      label: 'Reversiones',
      href: enumMf.PAY,
      active: router.basePath === enumMf.PAY,
    },
    {
      id: 4,
      icon: <i className="ri-printer-line"></i>,
      label: 'Re-impresiones',
      href: enumMf.BRING_CASH,
      active: router.basePath === enumMf.BRING_CASH,
    },
    {
      id: 5,
      icon: <i className="ri-file-list-2-line"></i>,
      label: 'Reportes',
      href: enumMf.VOUCHERS,
      active: router.basePath === enumMf.VOUCHERS,
    },
    {
      id: 6,
      icon: <i className="ri-currency-line"></i>,
      label: 'Consultas DAS',
      href: enumMf.REQUEST,
      active: router.basePath === enumMf.REQUEST,
    },
  ];

  return (
    <>
      <div
        className={`${styles.sideBar} ${isCollapsed ? styles.collapsed : ''}`}
      >
        {isCollapsed ? (
          <div className={styles.sideBar__logo}>
            <Picture
              src={Logo.src}
              alt={t('LogoML.image.alt')}
              height={35}
              width={58.89}
            />
          </div>
        ) : (
          <div className={styles.sideBar__logo}>
            <Picture
              src={LogoAndLetters}
              alt={t('LogoML.image.alt')}
              height={50}
              width={177.78}
            />
          </div>
        )}
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          {isCollapsed ? (
            <i className="ri-arrow-right-line"></i>
          ) : (
            <i className="ri-arrow-left-line"></i>
          )}
        </button>
        <div className={styles.sideBar__wrapper}>
          <SideMenuList listItems={items} isCollapsed={isCollapsed} />
          <div className={styles.sideBar__wrapper__configuration}>
            <ListItem
              isCollapsed={isCollapsed}
              asButton
              onClick={() => handleLogout()}
              label="Configuración"
              icon={<i className="ri-settings-3-line"></i>}
            />
          </div>
          <LastAccess />
        </div>
      </div>
      <div className={styles.sideBarTablet}>
        <Drawer
          closeDrawer={closeDrawer}
          openDrawer={openDrawer}
          isDrawerOpen={isDrawerOpen}
        >
          <div className={styles.header}>
            <div className={styles.header__closeIcon}>
              <button type="button" onClick={() => closeDrawer()}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className={styles.header__userSection}>
              <div className={styles.header__userSection__userIcon}>
                <i className="ri-user-line"></i>
              </div>
              <div className={styles.header__userSection__greets}>
                <span className={styles.greets}>Diana Valencia</span>
                <span className={styles.userName}>
                  {'Oficina: 100 CN Alajuela'}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.sideBarTablet__wrapper}>
            <div>
              <SideMenuList listItems={items} />
              <ListItem
                asButton
                onClick={() => handleLogout()}
                label="Configuración"
                icon={<i className="ri-settings-3-line"></i>}
              />
              <div className={styles.sideBarTablet__separator} />
              <ListItem
                asButton
                onClick={() => handleLogout()}
                label="Cerrar sesión"
                icon={<i className="ri-logout-circle-line"></i>}
              />
            </div>

            <LastAccess />
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default SideBar;
