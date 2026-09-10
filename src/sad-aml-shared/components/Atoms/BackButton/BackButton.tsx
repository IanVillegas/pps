import 'remixicon/fonts/remixicon.css';
import styles from './BackButton.module.scss';

interface BackButtonProps {
  onClick: () => void;
  label: string;
}

const BackButton = (props: BackButtonProps) => {
  const { label = 'Regresar', onClick = () => {} } = props;
  return (
    <button className={styles.backButton} onClick={onClick}>
      <i className={`${styles.backButton__icon} ri-arrow-left-line`}></i>
      <label className={styles.backButton__label}>{label}</label>
    </button>
  );
};

export default BackButton;
