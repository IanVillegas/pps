import styles from './RetryNotice.module.scss';

interface RetryNoticeProps {
  /** Que no se pudo cargar o guardar, en lenguaje de la persona */
  message: string;
  onRetry: () => void;
}

/**
 * Aviso de una carga que fallo, con la accion para volver a intentarla (DEC-019B)
 */
const RetryNotice = ({ message, onRetry }: RetryNoticeProps) => (
  <div role="alert" className={styles.retryNotice}>
    <span>{message}</span>
    <button
      type="button"
      className={styles.retryNotice__retry}
      onClick={onRetry}
    >
      Reintentar
    </button>
  </div>
);

export default RetryNotice;
