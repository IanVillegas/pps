import { ProfileNavigation } from '@/sad-aml-shared/components/Atoms';
import styles from '@/sad-aml-shared/components/Molecules/ProfileInfoHeader/ProfileInfoHeader.module.scss';

interface ProfileInfoHeaderProps {
  profileHref: string;
  settingsHref: string;
  logOutAction: () => void;
  clientName: string;
  openDrawer: () => void;
}

const ProfileInfoHeader = ({
  profileHref,
  settingsHref,
  logOutAction,
  clientName,
  openDrawer,
}: ProfileInfoHeaderProps) => {
  return (
    <div className={styles.profileInfo}>
      <div className={styles.profileInfo__userName}>
        <span className={styles.profileInfo__greet}>Diana Valencia</span>
        <span className={styles.profileInfo__name}>{clientName}</span>
      </div>
      <div className={styles.profileInfo__userIcon}>
        <div className={styles.profileInfo__userIcon__default}>
          <ProfileNavigation
            profileHref={profileHref}
            settingsHref={settingsHref}
            logOutAction={logOutAction}
          />
        </div>
        <div className={styles.profileInfo__userIcon__tablet}>
          <div className={styles.profileNavigationTablet}>
            <div className={styles.profileNavigationTablet__icon}>
              <i className="ri-user-line"></i>
            </div>
            <button
              className={styles.profileNavigationTablet__button}
              onClick={() => openDrawer()}
            >
              <i className="ri-menu-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoHeader;
