import type { CSSProperties, ReactNode } from 'react';
import styles from '@/sad-aml-shared/components/Templates/Container/Container.module.scss';

interface ContainerProps {
  children: ReactNode;
  customStyles?: CSSProperties;
}

const Container = ({ children, customStyles }: ContainerProps) => {
  return (
    <div style={customStyles} className={styles.container}>
      {children}
    </div>
  );
};

export default Container;
