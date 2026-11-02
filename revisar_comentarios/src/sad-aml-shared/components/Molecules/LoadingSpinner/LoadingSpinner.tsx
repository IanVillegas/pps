import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './LoadingSpinner.module.scss';
import type { LoadingSpinnerProps } from '@/sad-aml-shared/components/Molecules/LoadingSpinner/LoadingSpinner.type';
import { TextInformation, Spinner } from '@/sad-aml-shared/components/Atoms';
import { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';
import { SizeEnum } from '@/sad-aml-shared/types/enum/Size.enum';

/**
 * LoadingSpinner component that displays a loading animation with optional text
 *
 * @component
 * @param {LoadingSpinnerProps} props - Component props
 * @param {string} [props.text] - Optional text to display below spinner. If not provided, uses 'loading' translation key
 * @param {SizeEnum} [props.size=SizeEnum.Large] - Size of the spinner (Small, Medium, Large)
 * @param {ColorEnum} [props.color=ColorEnum.Dark] - Color of the spinner (Light, Dark, etc)
 * @returns {JSX.Element} Rendered loading spinner with text
 *
 * @example
 * // Basic usage
 * <LoadingSpinner />
 *
 * @example
 * // With custom text and styling
 * <LoadingSpinner
 *   text="Loading data..."
 *   size={SizeEnum.Small}
 *   color={ColorEnum.Light}
 * />
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text,
  size = SizeEnum.Large,
  color = ColorEnum.Dark,
}: LoadingSpinnerProps): JSX.Element => {
  const [t] = useTranslation('global');

  return (
    <div className={styles.container}>
      <Spinner color={color} size={size} />
      <TextInformation className={`${styles.text} ${styles[`text__${size}`]}`}>
        {text || t('loading')}
      </TextInformation>
    </div>
  );
};

export default LoadingSpinner;
