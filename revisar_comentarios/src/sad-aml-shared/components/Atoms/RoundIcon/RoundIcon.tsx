import type { ReactNode } from 'react';
import style from '@/sad-aml-shared/components/Atoms/RoundIcon/RoundIcon.module.scss';
import { classNames } from '@/sad-aml-shared/utils/helpers/stringHelpers';

interface IPropsRoundIcon {
  icon?: ReactNode;
  width: number;
  height: number;
  color:
    | 'green'
    | 'gray'
    | 'yellow'
    | 'disabled'
    | 'dark'
    | 'red'
    | 'white'
    | 'grey'
    | 'transparent'
    | 'blue';
  customClasses?: string[];
}

const RoundIcon = ({
  icon,
  width,
  height,
  color,
  customClasses,
}: IPropsRoundIcon) => {
  customClasses = customClasses?.map(className => style[className]) ?? [];
  return (
    <div
      className={classNames([`${style.icon}`, style['icon_' + color]])}
      style={{ width: width, height: height }}
    >
      <span
        className={classNames([
          `${style.icon_container}`,
          style['icon_container_' + color],
          ...customClasses,
        ])}
      >
        {icon}
      </span>
    </div>
  );
};

export default RoundIcon;
