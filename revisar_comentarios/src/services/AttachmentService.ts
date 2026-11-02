// DEC-009B Adjuntos de un ingreso.
// ! [SIMULADO] Subida de adjuntos simulada. Reemplazar por el adaptador real o borrar al conectar el backend

// La subida en si no existe: se resuelve con temporizadores, igual que
// AuthService. Un archivo cuyo nombre contiene "error" (sin distinguir
// mayusculas) permite probar el estado de error de forma repetible
// Datos de prueba: cualquier nombre que contenga "error" (ej. "error.pdf")

export interface UploadAttachmentOptions {
  onProgress?: (percent: number) => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Simula la subida de un archivo ya validado */
export const uploadAttachment = async (
  file: File,
  { onProgress }: UploadAttachmentOptions = {}
): Promise<void> => {
  const fails = file.name.toLowerCase().includes('error');
  onProgress?.(30);
  await delay(300);
  onProgress?.(70);
  await delay(300);
  if (fails) {
    throw new Error('No se pudo subir el archivo');
  }
  onProgress?.(100);
  await delay(150);
};
