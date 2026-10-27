import styles from './RetryNotice.module.scss';

interface RetryNoticeProps {
  /** Que no se pudo cargar o guardar, en lenguaje de la persona. */
  message: string;
  onRetry: () => void;
}

/**
 * Aviso de una carga que fallo, con la accion para volver a intentarla
 * (DEC-019B). Se anuncia a los lectores de pantalla y no desaparece solo: la
 * persona decide cuando reintentar. Lo usan los totales del backend y las
 * listas de opciones.
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
