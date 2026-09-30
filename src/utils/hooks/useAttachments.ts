'use client';

import { useCallback, useRef, useState } from 'react';
import { uploadAttachment } from '@/services/AttachmentService';
import { createId } from '@/utils/ids';
import type {
  AttachmentFile,
  AttachmentStatus,
} from '@/types/Attachment.types';

interface UseAttachmentsOptions {
  /** Tipos MIME aceptados, separados por coma. Por defecto solo PDF (D-05). */
  accept?: string;
  /** Tamano maximo por archivo. Por defecto 5 MB (Figma, nodo 43121:5780: "5Mb max"). */
  maxSizeBytes?: number;
  /** Cantidad maxima de archivos. SIMBOLICO: D-05 no define un numero real. */
  maxFiles?: number;
}

interface UseAttachmentsResult {
  files: AttachmentFile[];
  /** Valida y agrega archivos nuevos; los validos arrancan su subida simulada. */
  addFiles: (selected: FileList | File[]) => void;
  remove: (id: string) => void;
  /** Reintenta un archivo en 'error' sin que la persona tenga que re-seleccionarlo. */
  retry: (id: string) => void;
}

const DEFAULT_ACCEPT = 'application/pdf';
const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024;
const DEFAULT_MAX_FILES = 5;

/**
 * Selección y subida simulada de adjuntos (DEC-009B). Separado de
 * `FileUpload` (que solo dibuja `files`) para no repetir esta logica en cada
 * paso que necesite adjuntos (ingresos, egresos, etc. — D-05, plan.md). Un
 * archivo "seleccionado" (`status: 'selected'`) todavia NO cuenta como
 * "subido" (`status: 'uploaded'`): son estados distintos a proposito (D-05).
 */
export const useAttachments = (
  options: UseAttachmentsOptions = {}
): UseAttachmentsResult => {
  const accept = options.accept ?? DEFAULT_ACCEPT;
  const maxSizeBytes = options.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;
  const maxFiles = options.maxFiles ?? DEFAULT_MAX_FILES;

  const [files, setFiles] = useState<AttachmentFile[]>([]);
  // Los File reales no son serializables (no van en el borrador); se
  // guardan aparte, indexados por id, solo mientras dura la sesion.
  const rawFiles = useRef(new Map<string, File>());

  const updateFile = useCallback(
    (id: string, patch: Partial<AttachmentFile>) => {
      setFiles(current =>
        current.map(item => (item.id === id ? { ...item, ...patch } : item))
      );
    },
    []
  );

  const startUpload = useCallback(
    (id: string, file: File) => {
      updateFile(id, {
        status: 'uploading',
        progress: 0,
        errorMessage: undefined,
      });
      uploadAttachment(file, {
        onProgress: percent => updateFile(id, { progress: percent }),
      })
        .then(() => updateFile(id, { status: 'uploaded', progress: 100 }))
        .catch(() =>
          updateFile(id, {
            status: 'error',
            errorMessage:
              'No se pudo subir el archivo. Puede intentarlo de nuevo.',
          })
        );
    },
    [updateFile]
  );

  const addFiles = useCallback(
    (selected: FileList | File[]) => {
      const incoming = Array.from(selected);
      if (incoming.length === 0) return;

      const room = Math.max(maxFiles - files.length, 0);
      const accepted = incoming.slice(0, room);
      const acceptedTypes = accept.split(',').map(type => type.trim());

      const added: AttachmentFile[] = accepted.map(file => {
        const id = createId();
        rawFiles.current.set(id, file);
        if (!acceptedTypes.includes(file.type)) {
          return {
            id,
            name: file.name,
            status: 'invalid' as AttachmentStatus,
            errorMessage: 'Solo se aceptan archivos PDF',
          };
        }
        if (file.size > maxSizeBytes) {
          const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
          return {
            id,
            name: file.name,
            status: 'invalid' as AttachmentStatus,
            errorMessage: `El archivo supera el tamaño máximo (${maxMb} MB)`,
          };
        }
        return { id, name: file.name, status: 'selected' as AttachmentStatus };
      });

      setFiles(current => [...current, ...added]);
      added
        .filter(item => item.status === 'selected')
        .forEach(item =>
          startUpload(item.id, rawFiles.current.get(item.id) as File)
        );
    },
    [accept, files.length, maxFiles, maxSizeBytes, startUpload]
  );

  const remove = useCallback((id: string) => {
    rawFiles.current.delete(id);
    setFiles(current => current.filter(item => item.id !== id));
  }, []);

  const retry = useCallback(
    (id: string) => {
      const file = rawFiles.current.get(id);
      if (file) startUpload(id, file);
    },
    [startUpload]
  );

  return { files, addFiles, remove, retry };
};
