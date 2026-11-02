// Miniatura de la primera pagina de un PDF para las tarjetas de adjuntos
// (FileUpload). Usa pdf.js, que se carga SOLO cuando se elige un archivo

const THUMBNAIL_WIDTH = 270;
const THUMBNAIL_HEIGHT = 138;

export const createPdfThumbnail = async (file: File): Promise<string> => {
  const pdfjs = await import('pdfjs-dist');
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  }

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  });
  try {
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const scale = THUMBNAIL_WIDTH / page.getViewport({ scale: 1 }).width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = THUMBNAIL_WIDTH;
    canvas.height = THUMBNAIL_HEIGHT;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D no disponible');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvas, canvasContext: context, viewport }).promise;
    return canvas.toDataURL('image/jpeg', 0.8);
  } finally {
    await loadingTask.destroy();
  }
};
