import { act, renderHook } from '@testing-library/react';
import { useAttachments } from './useAttachments';
import { createPdfThumbnail } from '@/utils/pdfThumbnail';

const pdf = (name: string, sizeBytes = 1024) =>
  new File([new Uint8Array(sizeBytes)], name, { type: 'application/pdf' });

// Las esperas simuladas de AttachmentService suman 750ms (300+300+150).
// `advanceTimersByTimeAsync` (no la variante sincrona): cada `delay()`
// encadena un `await` entre temporizadores, y solo la version async le deja
// espacio a esos microtasks entre un avance y el siguiente (mismo criterio
// que AuthService.test.ts).
const flushUpload = async () => {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(750);
  });
};

describe('useAttachments', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // La miniatura nunca llega salvo en las pruebas que la piden: una
    // respuesta que llega sola, fuera de `act`, ensucia la salida.
    jest.mocked(createPdfThumbnail).mockReturnValue(new Promise(() => {}));
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('adds a valid PDF as selected and ends uploaded', async () => {
    const { result } = renderHook(() => useAttachments());
    act(() => result.current.addFiles([pdf('cedula.pdf')]));
    // No hay que esperar el primer tick: el hook ya pasa a 'uploading' en el
    // mismo evento (ver useAttachments: startUpload llama a updateFile antes
    // de cualquier await).
    expect(result.current.files[0].status).toBe('uploading');

    await flushUpload();
    expect(result.current.files[0]).toMatchObject({
      name: 'cedula.pdf',
      status: 'uploaded',
      progress: 100,
    });
  });

  it('starts with already uploaded files when given their names', () => {
    const { result } = renderHook(() =>
      useAttachments({ initialFileNames: ['cedula.pdf', 'recibo.pdf'] })
    );
    expect(result.current.files.map(file => file.name)).toEqual([
      'cedula.pdf',
      'recibo.pdf',
    ]);
    expect(result.current.files.every(f => f.status === 'uploaded')).toBe(true);
  });

  it('adds the first-page thumbnail to a valid PDF once it is ready', async () => {
    jest
      .mocked(createPdfThumbnail)
      .mockResolvedValueOnce('data:image/jpeg;base64,THUMBNAIL');
    const { result } = renderHook(() => useAttachments());
    act(() => result.current.addFiles([pdf('cedula.pdf')]));
    await act(async () => {});
    expect(createPdfThumbnail).toHaveBeenCalled();
    expect(result.current.files[0].previewUrl).toBe(
      'data:image/jpeg;base64,THUMBNAIL'
    );
  });

  it('keeps the file working without a thumbnail when the PDF cannot be read', async () => {
    jest.mocked(createPdfThumbnail).mockRejectedValueOnce(new Error('corrupt'));
    const { result } = renderHook(() => useAttachments());
    act(() => result.current.addFiles([pdf('danado.pdf')]));
    await flushUpload();
    expect(result.current.files[0].previewUrl).toBeUndefined();
    expect(result.current.files[0].status).toBe('uploaded');
  });

  it('does not build a thumbnail for a rejected file', () => {
    jest.mocked(createPdfThumbnail).mockClear();
    const { result } = renderHook(() => useAttachments());
    const png = new File(['x'], 'imagen.png', { type: 'image/png' });
    act(() => result.current.addFiles([png]));
    expect(createPdfThumbnail).not.toHaveBeenCalled();
  });

  it('rejects a file that is not a PDF', () => {
    const { result } = renderHook(() => useAttachments());
    const png = new File(['x'], 'imagen.png', { type: 'image/png' });
    act(() => result.current.addFiles([png]));

    expect(result.current.files[0]).toMatchObject({ status: 'invalid' });
    expect(result.current.files[0].errorMessage).toMatch(/PDF/);
  });

  it('rejects a PDF larger than the configured limit', () => {
    const { result } = renderHook(() => useAttachments({ maxSizeBytes: 1000 }));
    act(() => result.current.addFiles([pdf('grande.pdf', 2000)]));

    expect(result.current.files[0]).toMatchObject({ status: 'invalid' });
    expect(result.current.files[0].errorMessage).toMatch(/tamaño máximo/);
  });

  it('does not add more files than maxFiles allows', () => {
    const { result } = renderHook(() => useAttachments({ maxFiles: 1 }));
    act(() =>
      result.current.addFiles([pdf('uno.pdf'), pdf('dos.pdf'), pdf('tres.pdf')])
    );
    expect(result.current.files).toHaveLength(1);
  });

  it('ends in error when the simulated upload fails, without removing the file', async () => {
    const { result } = renderHook(() => useAttachments());
    act(() => result.current.addFiles([pdf('error.pdf')]));

    await flushUpload();
    expect(result.current.files[0]).toMatchObject({ status: 'error' });
    expect(result.current.files[0].errorMessage).toBeTruthy();
  });

  it('retries an errored file without asking the person to pick it again', async () => {
    const { result } = renderHook(() => useAttachments());
    act(() => result.current.addFiles([pdf('error.pdf')]));
    await flushUpload();
    const id = result.current.files[0].id;

    act(() => result.current.retry(id));
    expect(result.current.files[0].status).toBe('uploading');

    await flushUpload();
    expect(result.current.files[0].status).toBe('error');
  });

  it('removes a file from the list', async () => {
    const { result } = renderHook(() => useAttachments());
    act(() => result.current.addFiles([pdf('cedula.pdf')]));
    await flushUpload();
    const id = result.current.files[0].id;

    act(() => result.current.remove(id));
    expect(result.current.files).toHaveLength(0);
  });
});
