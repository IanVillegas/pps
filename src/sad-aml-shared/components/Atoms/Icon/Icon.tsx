import styles from '@/sad-aml-shared/components/Atoms/Icon/Icon.module.scss';
import { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';
import type { IconProps } from '@/sad-aml-shared/components/Atoms/Icon/Icon.type';
import 'remixicon/fonts/remixicon.css';

const icon = ({
  name,
  size = 24,
  color = ColorEnum.Secondary,
  ariaLabel = '',
  onClick,
  style = {},
  text,
  textStyle,
}: IconProps) => {
  return (
    <i
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${name} 
                ${styles[color]} 
                `}
      style={{ fontSize: size, ...style }}
    >
      {text && <span className={textStyle}>{text}</span>}
    </i>
  );
};

export default icon;
