import { CurrencyInfo } from '@/sad-aml-shared/components/Atoms';
import { ProfileInfoHeader } from '@/sad-aml-shared/components/Molecules';
import styles from '@/sad-aml-shared/components/Organisms/Header/Header.module.scss';
//import store, { RootState } from '../../../../../redux/store'

interface IProp {
  handleLogout: () => void;
  openDrawer: () => void;
}

const Header = ({ handleLogout, openDrawer }: IProp) => {
  return (
    <header className={styles.wrapper}>
      <div className={styles.header}>
        <CurrencyInfo buyRate={'0'} sellRate={'0'} />
        <ProfileInfoHeader
          clientName={'Oficina: 100 CN Alajuela'}
          profileHref="/perfil"
          logOutAction={handleLogout}
          settingsHref="/configuracion"
          openDrawer={openDrawer}
        />
      </div>
    </header>
  );
};

export default Header;
