export type AttachmentStatus =
  | 'selected'
  | 'uploading'
  | 'uploaded'
  | 'error'
  | 'invalid';

export interface AttachmentFile {
  /** Identificador estable de la fila (no depende de su posicion) */
  id: string;
  name: string;
  status: AttachmentStatus;
  /** Solo tiene sentido mientras `status` es 'uploading' */
  progress?: number;
  /** Mensaje para 'error'/'invalid' ejemplo "Solo se aceptan PDF" */
  errorMessage?: string;
  /** Miniatura de la primera pagina (data URL) */
  previewUrl?: string;
}
