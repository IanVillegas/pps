import styles from '@/sad-aml-shared/components/Atoms/TextInformation/TextInformation.module.scss';
import type { TextInformationProps } from '@/sad-aml-shared/components/Atoms/TextInformation/TextInformationType.type';

const TextInformation = ({
  children,
  className,
  customClass,
}: TextInformationProps) => {
  return (
    <div
      className={`${customClass ? styles[customClass] : ''} ${className ? className : styles.text}`}
    >
      {children}
    </div>
  );
};

export default TextInformation;
