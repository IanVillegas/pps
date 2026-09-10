import type { ReactNode } from 'react';
import styles from './Alert.module.scss';
import { Icon } from '../../Atoms';
import { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';

interface AlertProps {
  icon?: string;
  color?: ColorEnum;
  date?: string;
  title?: string;
  description?: ReactNode;
  width?: string;
}

const Alert = ({
  icon,
  color = ColorEnum.Primary,
  date,
  title,
  description,
  width = '100%',
}: AlertProps) => {
  return (
    <div
      className={`
            ${styles.container}
            ${styles[color]}
        `}
      style={{ width }}
    >
      <div className={`${styles[`${color}__header`]}`}>
        {icon && (
          <div className={`${styles[`${color}__icon`]}`}>
            <Icon name={`ri-${icon}`} />
          </div>
        )}

        {date && <div className={`${styles[`${color}__date`]}`}>{date}</div>}
      </div>

      {title && <div className={`${styles[`${color}__title`]}`}>{title}</div>}
      {description && (
        <div className={`${styles[`${color}__description`]}`}>
          {description}
        </div>
      )}
    </div>
  );
};

export default Alert;
