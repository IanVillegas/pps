import { ListItem } from '../../Atoms';
import styles from './SideMenuList.module.scss';
import React from 'react';

interface ListItems {
  id: number;
  icon: React.JSX.Element;
  label: string;
  href: string;
  active: boolean;
}

interface SideMenuListProps {
  listItems: ListItems[];
  isCollapsed?: boolean;
}

const SideMenuList = ({ listItems, isCollapsed }: SideMenuListProps) => {
  return (
    <div className={styles.sideMenu}>
      {listItems.map(item => (
        <ListItem
          key={item.id}
          href={item.href}
          icon={item.icon}
          isCollapsed={isCollapsed}
          //label={item.label}
          label={!isCollapsed ? item.label : ''}
          active={item.active}
        />
      ))}
    </div>
  );
};

export default SideMenuList;
