import {
  catalogLabel,
  getCatalog,
  getCatalogStatus,
  loadCatalogs,
  resetCatalogs,
  subscribeCatalogs,
  CURRENCY_OPTIONS,
} from './CatalogService';

const ORIGINAL_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const fetchMock = jest.fn();

const respond = (status: number, body: unknown) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_API_BASE_URL;
  global.fetch = fetchMock;
  fetchMock.mockReset();
  resetCatalogs();
});

afterAll(() => {
  if (ORIGINAL_BASE === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
  else process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_BASE;
  resetCatalogs();
});

describe('CatalogService (simulado)', () => {
  it('has every catalog ready from the first render without calling the API', async () => {
    expect(getCatalogStatus()).toBe('ready');
    expect(getCatalog('currencies')).toBe(CURRENCY_OPTIONS);
    await loadCatalogs();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(getCatalogStatus()).toBe('ready');
  });

  it('gives the text of a value and falls back to the value itself', () => {
    expect(catalogLabel('currencies', 'dolares')).toBe('Dólares');
    expect(catalogLabel('currencies', 'euros')).toBe('euros');
  });
});

describe('CatalogService (API real)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.test';
  });

  it('asks for every catalog by its path and publishes what the server sends', async () => {
    fetchMock.mockImplementation((url: string) =>
      respond(200, [{ value: 'x', label: `de ${url.split('/').pop()}` }])
    );
    const listener = jest.fn();
    const unsubscribe = subscribeCatalogs(listener);

    const loading = loadCatalogs();
    expect(getCatalogStatus()).toBe('loading');
    await loading;

    expect(fetchMock).toHaveBeenCalledTimes(13);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/catalogs/marital-status',
      expect.anything()
    );
    expect(getCatalogStatus()).toBe('ready');
    expect(catalogLabel('currencies', 'x')).toBe('de currencies');
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it('reports an error, keeps what did arrive and recovers on retry', async () => {
    fetchMock.mockImplementation((url: string) =>
      url.endsWith('/genders')
        ? respond(503, {})
        : respond(200, [{ value: 'ok', label: 'Recibido' }])
    );
    await loadCatalogs();
    expect(getCatalogStatus()).toBe('error');
    expect(catalogLabel('currencies', 'ok')).toBe('Recibido');
    // El que fallo sigue con los datos de antes, no queda vacio.
    expect(getCatalog('genders').length).toBeGreaterThan(0);

    fetchMock.mockImplementation(() =>
      respond(200, [{ value: 'ok', label: 'Recibido' }])
    );
    await loadCatalogs();
    expect(getCatalogStatus()).toBe('ready');
  });

  it('ignores the answer of an older load when a newer one started', async () => {
    let releaseOld!: () => void;
    const gate = new Promise<void>(resolve => {
      releaseOld = resolve;
    });
    fetchMock.mockImplementationOnce(() =>
      gate.then(() => respond(200, [{ value: 'old', label: 'Vieja' }]))
    );
    fetchMock.mockImplementation(() =>
      respond(200, [{ value: 'new', label: 'Nueva' }])
    );
    const first = loadCatalogs();
    const second = loadCatalogs();
    await second;
    releaseOld();
    await first;
    expect(catalogLabel('maritalStatus', 'new')).toBe('Nueva');
    expect(catalogLabel('maritalStatus', 'old')).toBe('old');
  });
});
