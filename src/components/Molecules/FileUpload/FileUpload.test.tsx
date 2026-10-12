import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from './FileUpload';
import type { AttachmentFile } from '@/types/Attachment.types';

const FILES: AttachmentFile[] = [
  { id: 'a', name: 'cedula.pdf', status: 'uploading', progress: 40 },
  { id: 'b', name: 'recibo.pdf', status: 'uploaded' },
  {
    id: 'c',
    name: 'falla.pdf',
    status: 'error',
    errorMessage: 'No se pudo subir el archivo.',
  },
  {
    id: 'd',
    name: 'imagen.png',
    status: 'invalid',
    errorMessage: 'Solo se aceptan archivos PDF',
  },
];

describe('FileUpload', () => {
  it('shows the drag-and-drop hint and no list when there are no files', () => {
    render(
      <FileUpload
        label="Adjuntos"
        files={[]}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    expect(
      screen.getByText('Arrastre y suelte el archivo aquí')
    ).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('renders one card per file with its name', () => {
    render(
      <FileUpload
        label="Adjuntos"
        files={FILES}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    FILES.forEach(file => {
      expect(screen.getByText(file.name)).toBeInTheDocument();
    });
  });

  it('shows the progress bar only while uploading, matching the reported percent', () => {
    render(
      <FileUpload
        label="Adjuntos"
        files={FILES}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    const bar = screen.getByRole('progressbar', {
      name: 'Subiendo cedula.pdf',
    });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
  });

  it('offers a remove button on every card, including the failed ones', () => {
    render(
      <FileUpload
        label="Adjuntos"
        files={FILES}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
        onRetry={jest.fn()}
      />
    );
    ['cedula.pdf', 'recibo.pdf', 'falla.pdf', 'imagen.png'].forEach(name => {
      expect(
        screen.getByRole('button', { name: `Quitar ${name}` })
      ).toBeInTheDocument();
    });
  });

  it('shows the thumbnail on an uploaded or uploading card but not on a failed one', () => {
    const withPreview: AttachmentFile[] = [
      {
        id: 'a',
        name: 'sube.pdf',
        status: 'uploading',
        progress: 10,
        previewUrl: 'data:image/jpeg;base64,A',
      },
      {
        id: 'b',
        name: 'listo.pdf',
        status: 'uploaded',
        previewUrl: 'data:image/jpeg;base64,B',
      },
      {
        id: 'c',
        name: 'falla.pdf',
        status: 'error',
        previewUrl: 'data:image/jpeg;base64,C',
      },
    ];
    const { container } = render(
      <FileUpload
        label="Adjuntos"
        files={withPreview}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    const sources = Array.from(container.querySelectorAll('img')).map(img =>
      img.getAttribute('src')
    );
    expect(sources).toEqual([
      'data:image/jpeg;base64,A',
      'data:image/jpeg;base64,B',
    ]);
  });

  it('keeps the status bar slot but only paints it while uploading or after a failure', () => {
    const { container } = render(
      <FileUpload
        label="Adjuntos"
        files={FILES}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    const cards = container.querySelectorAll('li');
    const track = (index: number) =>
      cards[index].querySelector('[class*="fileUpload__track"]');
    expect(cards).toHaveLength(4);
    FILES.forEach((_, index) => expect(track(index)).not.toBeNull());
    expect(track(0)?.className).toMatch(/visible/);
    expect(track(1)?.className).not.toMatch(/visible/);
    expect(track(2)?.className).toMatch(/visible/);
    expect(track(3)?.className).toMatch(/visible/);
  });

  it('uses the compact header only once there are files', () => {
    const { rerender } = render(
      <FileUpload
        label="Adjuntos"
        files={[]}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    const trigger = () =>
      screen.getByText('Arrastre y suelte el archivo aquí').closest('label');
    expect(trigger()?.className).not.toMatch(/compact/);
    rerender(
      <FileUpload
        label="Adjuntos"
        files={FILES}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    expect(trigger()?.className).toMatch(/compact/);
  });

  it('shows the error message for both error and invalid files', () => {
    render(
      <FileUpload
        label="Adjuntos"
        files={FILES}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
      />
    );
    expect(
      screen.getByText('No se pudo subir el archivo.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Solo se aceptan archivos PDF')
    ).toBeInTheDocument();
  });

  it('only offers "Reintentar" for the file in error, and calls onRetry with its id', async () => {
    const onRetry = jest.fn();
    render(
      <FileUpload
        label="Adjuntos"
        files={FILES}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
        onRetry={onRetry}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Reintentar falla.pdf' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Reintentar recibo/ })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Reintentar falla.pdf' })
    );
    expect(onRetry).toHaveBeenCalledWith('c');
  });

  it('calls onRemove with the right id and not onFilesSelected', async () => {
    const onRemove = jest.fn();
    const onFilesSelected = jest.fn();
    render(
      <FileUpload
        label="Adjuntos"
        files={FILES}
        onFilesSelected={onFilesSelected}
        onRemove={onRemove}
      />
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Quitar recibo.pdf' })
    );
    expect(onRemove).toHaveBeenCalledWith('b');
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it('calls onFilesSelected when a file is picked through the input', async () => {
    const onFilesSelected = jest.fn();
    render(
      <FileUpload
        label="Adjuntos"
        files={[]}
        onFilesSelected={onFilesSelected}
        onRemove={jest.fn()}
      />
    );
    const file = new File(['x'], 'cedula.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText('Adjuntos');
    await userEvent.upload(input, file);

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    const [[selected]] = onFilesSelected.mock.calls;
    expect(selected).toHaveLength(1);
    expect(selected[0].name).toBe('cedula.pdf');
  });

  it('calls onFilesSelected with the dropped files', () => {
    const onFilesSelected = jest.fn();
    const { container } = render(
      <FileUpload
        label="Adjuntos"
        files={[]}
        onFilesSelected={onFilesSelected}
        onRemove={jest.fn()}
      />
    );
    const file = new File(['x'], 'cedula.pdf', { type: 'application/pdf' });
    const dropzone = container.querySelector(
      '.fileUpload__dropzone'
    ) as HTMLElement;

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    expect(onFilesSelected.mock.calls[0][0][0].name).toBe('cedula.pdf');
  });

  it('shows a form-level error separate from a per-file one', () => {
    render(
      <FileUpload
        label="Adjuntos"
        files={[]}
        onFilesSelected={jest.fn()}
        onRemove={jest.fn()}
        errors="Adjunte al menos un documento"
      />
    );
    expect(
      screen.getByText('Adjunte al menos un documento')
    ).toBeInTheDocument();
  });
});
