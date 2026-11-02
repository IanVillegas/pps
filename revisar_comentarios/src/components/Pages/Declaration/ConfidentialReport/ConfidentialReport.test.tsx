import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfidentialReport from './ConfidentialReport';
import { clearConfidentialAnswers } from '@/services/ConfidentialReportService';
import { clearDraft, getDraft } from '@/services/DeclarationService';
import { getConfidentialAnswers } from '@/services/ConfidentialReportService';

beforeEach(() => {
  clearConfidentialAnswers();
  clearDraft();
});

const LIFESTYLE_START = '¿Ha observado cambios notables en el estilo de vida';
const toggle = (name: string | RegExp) => screen.getByRole('switch', { name });

describe('ConfidentialReport (paso 12)', () => {
  it('shows the confidentiality notice and the eight questions, all No', () => {
    render(<ConfidentialReport />);
    expect(
      screen.getByText(
        /recibida de forma confidencial únicamente por la Directora de Desarrollo Humano/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('¿Conoce usted si algún compañero(a)...?')
    ).toBeInTheDocument();
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(8);
    switches.forEach(item =>
      expect(item).toHaveAttribute('aria-checked', 'false')
    );
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('numbers the seven colleague questions and leaves the first one unnumbered', () => {
    render(<ConfidentialReport />);
    expect(
      toggle(/^1\. Esta siendo renuente a disfrutar de sus vacaciones/)
    ).toBeInTheDocument();
    expect(
      toggle(/^7\. Tiene comportamientos sospechosos/)
    ).toBeInTheDocument();
    expect(toggle(new RegExp(`^${LIFESTYLE_START}`))).toBeInTheDocument();
  });

  it('shows the instruction and the detail field only for the question answered Yes', async () => {
    render(<ConfidentialReport />);
    await userEvent.click(toggle(/^1\. Esta siendo renuente/));

    expect(
      screen.getByText(/Desarrolle su denuncia, procure ser amplio/)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Detalle de su denuncia sobre la pregunta 1')
    ).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(1);
  });

  it('keeps what was written while the question stays on Yes and drops it on No', async () => {
    render(<ConfidentialReport />);
    const question = toggle(/^3\. Posee un negocio propio/);
    await userEvent.click(question);
    await userEvent.type(
      screen.getByLabelText('Detalle de su denuncia sobre la pregunta 3'),
      'Vende productos en horario laboral'
    );
    expect(getConfidentialAnswers().ownBusiness?.detail).toBe(
      'Vende productos en horario laboral'
    );

    await userEvent.click(question);
    expect(
      screen.queryByLabelText('Detalle de su denuncia sobre la pregunta 3')
    ).not.toBeInTheDocument();
    expect(getConfidentialAnswers()).toEqual({});
  });

  it('keeps the answers when the person leaves the step and comes back', async () => {
    const { unmount } = render(<ConfidentialReport />);
    await userEvent.click(toggle(/^2\. Posee altos niveles/));
    await userEvent.type(
      screen.getByLabelText('Detalle de su denuncia sobre la pregunta 2'),
      'Cobros frecuentes'
    );
    unmount();

    render(<ConfidentialReport />);
    expect(toggle(/^2\. Posee altos niveles/)).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(
      screen.getByLabelText('Detalle de su denuncia sobre la pregunta 2')
    ).toHaveValue('Cobros frecuentes');
  });

  it('never stores the answers in the declaration draft', async () => {
    render(<ConfidentialReport />);
    await userEvent.click(toggle(new RegExp(`^${LIFESTYLE_START}`)));
    await userEvent.type(
      screen.getByLabelText(
        'Detalle de su denuncia sobre cambios notables en el estilo de vida'
      ),
      'Detalle estrictamente reservado'
    );

    expect(getConfidentialAnswers().lifestyle?.detail).toBe(
      'Detalle estrictamente reservado'
    );
    expect(getDraft().steps[12]).toBeUndefined();
    expect(JSON.stringify(getDraft())).not.toContain(
      'Detalle estrictamente reservado'
    );
  });
});
