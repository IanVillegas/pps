import { act, render, screen } from '@testing-library/react';
import AuthenticatedShell from './AuthenticatedShell';
import { apiRequest, setUnauthorizedHandler } from '@/services/api/apiClient';
import { resetCatalogs } from '@/services/CatalogService';
import {
  endSession,
  getSession,
  startMockSession,
} from '@/services/SessionService';

const replace = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => '/inicio',
  useRouter: () => ({ replace }),
}));

const ORIGINAL_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const fetchMock = jest.fn();

const ok = (body: unknown = []) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as Response);

beforeEach(() => {
  replace.mockClear();
  fetchMock.mockReset();
  global.fetch = fetchMock;
  delete process.env.NEXT_PUBLIC_API_BASE_URL;
  endSession();
  resetCatalogs();
  setUnauthorizedHandler(null);
});

afterAll(() => {
  if (ORIGINAL_BASE === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
  else process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_BASE;
});

describe('AuthenticatedShell', () => {
  it('sends a visit without a session to the login', () => {
    const { container } = render(
      <AuthenticatedShell>
        <p>Privado</p>
      </AuthenticatedShell>
    );
    expect(container).toBeEmptyDOMElement();
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('does not call the API for the catalogs while the system uses simulated data', () => {
    startMockSession('demo');
    render(
      <AuthenticatedShell>
        <p>Privado</p>
      </AuthenticatedShell>
    );
    expect(screen.getByText('Privado')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('asks the API for the catalogs once there is a session when it is configured', async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.test';
    fetchMock.mockImplementation(() => ok());
    startMockSession('demo');
    await act(async () => {
      render(
        <AuthenticatedShell>
          <p>Privado</p>
        </AuthenticatedShell>
      );
    });
    expect(fetchMock).toHaveBeenCalledTimes(13);
  });

  it('ends the session and goes to the login when the API answers 401', async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.test';
    fetchMock.mockImplementation(() => ok());
    startMockSession('demo');
    await act(async () => {
      render(
        <AuthenticatedShell>
          <p>Privado</p>
        </AuthenticatedShell>
      );
    });

    fetchMock.mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ code: 'unauthorized' }),
      } as Response)
    );
    await act(async () => {
      await apiRequest('GET', '/me').catch(() => undefined);
    });

    expect(getSession()).toBeNull();
    expect(replace).toHaveBeenCalledWith('/');
  });
});
