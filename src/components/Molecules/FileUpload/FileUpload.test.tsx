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
