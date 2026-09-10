import type { ReactNode } from 'react';
import styles from '@/sad-aml-shared/components/Atoms/Card/Card.module.scss';

interface CardProps {
  width?: number | string | undefined;
  height?: number | string | undefined;
  className?: string;
  backgroundColor?: string | undefined;
  boxShadow?: string | undefined;
  marginLeft?: number | string | undefined;
  marginRight?: number | string | undefined;
  marginTop?: number | string | undefined;
  marginBottom?: number | string | undefined;
  margin?: number | string | undefined;
  paddingTop?: number | string | undefined;
  paddingBottom?: number | string | undefined;
  paddingLeft?: number | string | undefined;
  paddingRight?: number | string | undefined;
  padding?: number | string | undefined;
  leftBorderColor?: string;
  children: ReactNode;
  onClick?: () => void;
}

const Card = ({
  width,
  height,
  className,
  backgroundColor,
  boxShadow,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  margin,
  paddingTop,
  paddingBottom,
  paddingRight,
  paddingLeft,
  padding,
  leftBorderColor,
  children,
  onClick,
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.card} ${className ?? ''} ${leftBorderColor ? styles.borderColor : ''}`}
      style={{
        width: width ? width : 'auto',
        minHeight: height ? height : 'auto',
        ...(backgroundColor !== undefined && { backgroundColor }),
        ...(boxShadow !== undefined && { boxShadow }),
        ...(margin !== undefined && { margin }),
        ...(marginLeft !== undefined && { marginLeft }),
        ...(marginRight !== undefined && { marginRight }),
        ...(marginTop !== undefined && { marginTop }),
        ...(marginBottom !== undefined && { marginBottom }),
        ...(padding !== undefined && { padding }),
        ...(paddingTop !== undefined && { paddingTop }),
        ...(paddingBottom !== undefined && { paddingBottom }),
        ...(paddingLeft !== undefined && { paddingLeft }),
        ...(paddingRight !== undefined && { paddingRight }),
        ...(leftBorderColor && {
          ['--border-color' as any]: leftBorderColor,
        }),
      }}
    >
      {children}
    </div>
  );
};

export default Card;
