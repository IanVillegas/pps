// Adjuntos de un paso (hoy solo DEC-009B construye el selector; el primer
// consumidor real es DEC-009C, Ingreso adicional, nodos Figma 43121:5766 y
// 43121:5788 -- "sin adjuntos" y "con adjuntos", mismo modal).
export type AttachmentStatus =
  | 'selected'
  | 'uploading'
  | 'uploaded'
  | 'error'
  | 'invalid';

export interface AttachmentFile {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  name: string;
  status: AttachmentStatus;
  /** 0-100; solo tiene sentido mientras `status` es 'uploading'. */
  progress?: number;
  /** Mensaje para 'error'/'invalid' (ej. "Solo se aceptan PDF"). */
  errorMessage?: string;
}
