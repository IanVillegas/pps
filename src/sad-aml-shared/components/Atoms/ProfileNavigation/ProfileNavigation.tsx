import { Button } from '@/sad-aml-shared/components/Atoms';
import styles from '@/sad-aml-shared/components/Atoms/ProfileNavigation/ProfileNavigation.module.scss';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface ProfileNavigationProps {
  profileHref: string;
  settingsHref: string;
  logOutAction: () => void;
}

const ProfileNavigation = ({ logOutAction }: ProfileNavigationProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={styles.wrapperTrigger}
          aria-label="Customise options"
        >
          <div className={styles.wrapperTrigger__icon}>
            <i className="ri-user-line"></i>
          </div>
          <span className={styles.wrapperTrigger__caretDown}>
            <i className="ri-arrow-down-s-line"></i>
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.wrapperContent} sideOffset={5}>
          <DropdownMenu.Item>
            <Button
              text="Cerrar sesión"
              lefIcon={<i className="ri-logout-circle-r-line"></i>}
              onClick={logOutAction}
              className={
                styles.wrapperContent__item +
                ' ' +
                styles.wrapperContent__item__logout
              }
            ></Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ProfileNavigation;
