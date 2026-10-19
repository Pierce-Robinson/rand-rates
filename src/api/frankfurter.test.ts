import { ApiError, fetchHistory, fetchLatest } from '@/api/frankfurter';

function mockFetch(response: Partial<Response> | Error) {
  const fn = jest.fn((_url: string) => (response instanceof Error ? Promise.reject(response) : Promise.resolve(response)));
  globalThis.fetch = fn as unknown as typeof fetch;
  return fn;
}

describe('fetchLatest', () => {
  it('requests rates against the given base', async () => {
    const fetchMock = mockFetch({
      ok: true,
      json: () => Promise.resolve({ base: 'ZAR', date: '2026-10-16', rates: { USD: 0.06 } }),
    });

    const result = await fetchLatest('ZAR');

    expect(fetchMock.mock.calls[0][0]).toContain('/latest?base=ZAR');
    expect(result.rates.USD).toBe(0.06);
  });

  it('turns HTTP errors into ApiError with the status', async () => {
    mockFetch({ ok: false, status: 503 });
    await expect(fetchLatest('ZAR')).rejects.toMatchObject({ name: 'ApiError', status: 503 });
  });

  it('turns network failures into a friendly ApiError', async () => {
    mockFetch(new TypeError('Network request failed'));
    await expect(fetchLatest('ZAR')).rejects.toBeInstanceOf(ApiError);
    await expect(fetchLatest('ZAR')).rejects.toThrow('Could not reach the rates service');
  });
});

describe('fetchHistory', () => {
  it('returns points for the symbol, oldest first', async () => {
    mockFetch({
      ok: true,
      json: () =>
        Promise.resolve({
          rates: { '2026-10-02': { USD: 0.0598 }, '2026-10-01': { USD: 0.0604 }, '2026-10-05': {} },
        }),
    });

    const points = await fetchHistory('ZAR', 'USD', '2026-10-01', '2026-10-05');

    expect(points).toEqual([
      { date: '2026-10-01', rate: 0.0604 },
      { date: '2026-10-02', rate: 0.0598 },
    ]);
  });
});
