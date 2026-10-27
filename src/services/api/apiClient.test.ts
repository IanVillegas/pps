import {
  ApiError,
  apiRequest,
  GENERIC_ERROR_MESSAGE,
  isMockMode,
  setUnauthorizedHandler,
} from './apiClient';

const ORIGINAL_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const fetchMock = jest.fn();

const json = (status: number, body?: unknown) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () =>
      body === undefined
        ? Promise.reject(new Error('sin cuerpo'))
        : Promise.resolve(body),
  } as Response);

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.test/';
  global.fetch = fetchMock;
  fetchMock.mockReset();
  setUnauthorizedHandler(null);
});

afterAll(() => {
  if (ORIGINAL_BASE === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
  else process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_BASE;
});

describe('apiClient', () => {
  it('works with simulated data while no base URL is configured', async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = '';
    expect(isMockMode()).toBe(true);
    await expect(apiRequest('GET', '/catalogs/genders')).rejects.toMatchObject({
      status: 0,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('is in real mode once the base URL is set', () => {
    expect(isMockMode()).toBe(false);
  });

  it('sends the request with the session cookie and no double slash', async () => {
    fetchMock.mockReturnValue(json(200, [{ value: 'a', label: 'A' }]));
    const result = await apiRequest('GET', '/catalogs/genders');
    expect(result).toEqual([{ value: 'a', label: 'A' }]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/catalogs/genders',
      expect.objectContaining({ method: 'GET', credentials: 'include' })
    );
  });

  it('sends a JSON body with its content type', async () => {
    fetchMock.mockReturnValue(json(200, {}));
    await apiRequest('POST', '/x', { body: { a: 1 } });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/x',
      expect.objectContaining({
        body: '{"a":1}',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('returns undefined for 204', async () => {
    fetchMock.mockReturnValue(json(204));
    await expect(apiRequest('DELETE', '/x/1')).resolves.toBeUndefined();
  });

  it('turns a validation error into an ApiError with its field messages', async () => {
    fetchMock.mockReturnValue(
      json(422, {
        code: 'validation_error',
        message: 'Revise los datos',
        errors: { name: 'Requerido' },
      })
    );
    const error = await apiRequest('POST', '/x').catch(e => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 422,
      code: 'validation_error',
      message: 'Revise los datos',
      fieldErrors: { name: 'Requerido' },
    });
  });

  it('uses the generic message for a server failure and for a dead network', async () => {
    fetchMock.mockReturnValueOnce(json(503, { message: 'detalle interno' }));
    await expect(apiRequest('GET', '/x')).rejects.toMatchObject({
      status: 503,
      message: GENERIC_ERROR_MESSAGE,
    });
    fetchMock.mockRejectedValueOnce(new TypeError('failed to fetch'));
    await expect(apiRequest('GET', '/x')).rejects.toMatchObject({
      status: 0,
      message: GENERIC_ERROR_MESSAGE,
    });
  });

  it('tells the handler when the session is gone (401) and still fails the call', async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    fetchMock.mockReturnValue(json(401, { code: 'unauthorized' }));
    await expect(apiRequest('GET', '/me')).rejects.toMatchObject({
      status: 401,
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
