'use client';

import { useId, useState, type ChangeEvent, type DragEvent } from 'react';
import type { AttachmentFile } from '@/types/Attachment.types';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
  /** Nombre accesible de la zona de arrastre (no se ve; Figma no dibuja un label). */
  label: string;
  files: AttachmentFile[];
  onFilesSelected: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  /** Solo tiene sentido para archivos en 'error' (ver Figma, tarjeta "restart"). */
  onRetry?: (id: string) => void;
  accept?: string;
  disabled?: boolean;
  errors?: string;
}

const STATUS_ICON: Record<AttachmentFile['status'], string> = {
  selected: 'ri-attachment-2',
  uploading: 'ri-loader-4-line',
  uploaded: 'ri-attachment-2',
  error: 'ri-alert-line',
  invalid: 'ri-alert-line',
};

/**
 * Selector de adjuntos con arrastrar-y-soltar (DEC-009B, nodo Figma 43121:5780
 * / 43121:5802). Solo dibuja `files`; no valida ni sube nada por su cuenta
 * (ver `useAttachments`, que si lo hace) para poder reutilizarse en cualquier
 * paso que necesite adjuntos sin repetir esa logica.
 *
 * El `<label>` que abre el selector de archivos SOLO envuelve el icono y el
 * texto de arrastre (como en Figma); la lista de tarjetas ya agregadas es
 * hermana, no hija, del label -- un boton de "retirar"/"reintentar" dentro de
 * un label reenvia su click al selector de archivos, y evitarlo a mano
 * (preventDefault) es fragil. La caja punteada sigue siendo un solo
 * arrastre-y-suelte porque el contenedor exterior, no el label, es quien
 * escucha `onDrop`.
 */
const FileUpload = ({
  label,
  files,
  onFilesSelected,
  onRemove,
  onRetry,
  accept = 'application/pdf',
  disabled,
  errors,
}: FileUploadProps) => {
  const inputId = useId();
  const errorId = errors ? `${inputId}-error` : undefined;
  const [dragging, setDragging] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesSelected(event.target.files);
    }
    // Permite volver a elegir el mismo archivo (ej. tras retirarlo).
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    if (event.dataTransfer.files.length > 0) {
      onFilesSelected(event.dataTransfer.files);
    }
  };

  return (
    <div className={styles.fileUpload}>
      <div
        className={`${styles.fileUpload__dropzone} ${dragging ? styles['fileUpload__dropzone--dragging'] : ''} ${disabled ? styles['fileUpload__dropzone--disabled'] : ''}`}
        onDragOver={event => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <label htmlFor={inputId} className={styles.fileUpload__trigger}>
          <input
            id={inputId}
            className={styles.fileUpload__input}
            type="file"
            accept={accept}
            multiple
            disabled={disabled}
            aria-label={label}
            aria-invalid={errors ? true : undefined}
            aria-describedby={errorId}
            onChange={handleChange}
          />
          <i className="ri-upload-cloud-2-line" aria-hidden="true" />
          <p className={styles.fileUpload__hint}>
            <span>Arrastre y suelte el archivo aquí</span>
            <br />
            <span>
              o <span className={styles.fileUpload__link}>selecciónelo</span>{' '}
              desde su equipo (5Mb max)
            </span>
          </p>
        </label>

        {files.length > 0 && (
          <ul className={styles.fileUpload__list}>
            {files.map(file => (
              <li key={file.id} className={styles.fileUpload__card}>
                <div className={styles.fileUpload__cardActions}>
                  {file.status === 'error' && onRetry && (
                    <button
                      type="button"
                      aria-label={`Reintentar ${file.name}`}
                      onClick={() => onRetry(file.id)}
                    >
                      <i className="ri-restart-line" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={`Quitar ${file.name}`}
                    onClick={() => onRemove(file.id)}
                  >
                    <i className="ri-delete-bin-line" aria-hidden="true" />
                  </button>
                </div>
                <div className={styles.fileUpload__cardBody}>
                  <i
                    className={`${STATUS_ICON[file.status]} ${styles[`fileUpload__status--${file.status}`]} ${file.status === 'uploading' ? styles.fileUpload__spin : ''}`}
                    aria-hidden="true"
                  />
                </div>
                {file.status === 'uploading' && (
                  <div
                    className={styles.fileUpload__progress}
                    role="progressbar"
                    aria-label={`Subiendo ${file.name}`}
                    aria-valuenow={file.progress ?? 0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={styles.fileUpload__progressFill}
                      style={{ width: `${file.progress ?? 0}%` }}
                    />
                  </div>
                )}
                <p className={styles.fileUpload__name} title={file.name}>
                  {file.name}
                </p>
                {(file.status === 'error' || file.status === 'invalid') &&
                  file.errorMessage && (
                    <p className={styles.fileUpload__error} role="alert">
                      {file.errorMessage}
                    </p>
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errors && (
        <div id={errorId} className={styles.fileUpload__formError} role="alert">
          {errors}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
