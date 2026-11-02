'use client';
import {
  Card,
  Icon,
  Picture,
  TextInformation,
} from '@/sad-aml-shared/components/Atoms';
import style from '@/sad-aml-shared/components/Atoms/CardRadioButton/CardRadioButton.module.scss';
import { isIconName } from '@/sad-aml-shared/utils/functions/isIconName';
import type { InputHTMLAttributes } from 'react';

interface IPropsCardRadioButton extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  mediaElement?: string;
  onClick?: () => void;
  sizemediaElement?: 'md' | 'lg';
  isActive?: boolean;
  customBackgroundColor?: 'green-100' | 'yellow-100' | string;
  iconColor?:
    | 'secondary'
    | 'gray-300'
    | 'gray-400'
    | 'gray-500'
    | 'primary'
    | 'yellow-600'
    | 'warning'
    | string;
}

const CardRadioButton = (props: IPropsCardRadioButton) => {
  const {
    label,
    mediaElement,
    onClick,
    sizemediaElement = 'lg',
    isActive = false,
    customBackgroundColor,
    iconColor,
  } = props;
  return (
    <Card
      width={'160px'}
      padding={'16px'}
      onClick={onClick}
      className={`${style.cardRadioButton} ${isActive && customBackgroundColor ? style[customBackgroundColor] : ''}`}
    >
      <div
        className={`${style.cardRadioButton__icon} ${!isActive && customBackgroundColor ? style[customBackgroundColor] : ''}`}
      >
        {isIconName(mediaElement as string) ? (
          <Icon
            name={mediaElement || ''}
            size={sizemediaElement === 'lg' ? 40 : 28}
            color={iconColor}
          />
        ) : (
          <Picture
            src={mediaElement || ''}
            width={sizemediaElement === 'lg' ? 45 : 31}
            height={sizemediaElement === 'lg' ? 45 : 31}
            alt={label || ''}
          />
        )}
      </div>
      <div className={style.cardRadioButton__row}>
        <span
          className={`${style.cardRadioButton__radio}${isActive ? ' ' + style.active : ''}`}
        />
        <TextInformation className={style.cardRadioButton__label}>
          {label}
        </TextInformation>
      </div>
    </Card>
  );
};

export default CardRadioButton;
