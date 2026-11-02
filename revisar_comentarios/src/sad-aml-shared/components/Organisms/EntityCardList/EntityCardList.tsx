import { EntityCard } from '@/sad-aml-shared/components/Molecules';
import styles from '@/sad-aml-shared/components/Organisms/EntityCardList/EntityCardList.module.scss';
import React from 'react';

interface EntityCard {
  id: number;
  favoriteLogo?: boolean;
  mediaElement: string;
  leftBorderColor?: string;
  title?: string;
  subtitle?: string;
  textInformation?: string;
}

interface EntityCardListProps {
  serviceList: EntityCard[];
  className?: string;
  isIcon?: boolean;
}

const EntityCardList = ({
  serviceList,
  className,
  isIcon,
}: EntityCardListProps) => {
  return (
    <div className={styles.listItems} role="list">
      {serviceList.map(item => (
        <EntityCard
          key={item.id}
          favoriteLogo={item.favoriteLogo}
          mediaElement={item.mediaElement}
          leftBorderColor={item.leftBorderColor}
          title={item.title}
          subtitle={item.subtitle}
          textInformation={item.textInformation}
          className={className}
          isIcon={isIcon}
        />
      ))}
    </div>
  );
};

export default EntityCardList;
