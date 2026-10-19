import { convert, formatPercent, formatRateDate, parseAmount, randPerUnit, seriesStats } from '@/utils/currency';

// Units of each currency per 1 ZAR.
const rates = { USD: 0.05, EUR: 0.04, JPY: 8 };

describe('convert', () => {
  it('converts from the rand', () => {
    expect(convert(100, 'ZAR', 'USD', rates)).toBeCloseTo(5);
  });

  it('converts to the rand', () => {
    expect(convert(5, 'USD', 'ZAR', rates)).toBeCloseTo(100);
  });

  it('converts between two foreign currencies via the rand', () => {
    // 10 USD = 200 ZAR = 8 EUR
    expect(convert(10, 'USD', 'EUR', rates)).toBeCloseTo(8);
  });

  it('returns null for unknown currencies or bad amounts', () => {
    expect(convert(1, 'XXX', 'USD', rates)).toBeNull();
    expect(convert(Number.NaN, 'USD', 'EUR', rates)).toBeNull();
  });
});

describe('randPerUnit', () => {
  it('inverts the quoted rate', () => {
    expect(randPerUnit('USD', rates)).toBeCloseTo(20);
    expect(randPerUnit('JPY', rates)).toBeCloseTo(0.125);
    expect(randPerUnit('ZAR', rates)).toBe(1);
  });
});

describe('parseAmount', () => {
  it.each([
    ['1500', 1500],
    ['1 500', 1500],
    ['1 500,50', 1500.5],
    ['1,500.50', 1500.5],
    ['1.500,50', 1500.5],
    ['0,5', 0.5],
    ['.5', 0.5],
  ])('parses %p as %p', (input, expected) => {
    expect(parseAmount(input)).toBeCloseTo(expected);
  });

  it.each(['', 'abc', '-5', '1..2', '.'])('rejects %p', (input) => {
    expect(parseAmount(input)).toBeNull();
  });
});

describe('seriesStats', () => {
  it('summarises a series', () => {
    expect(seriesStats([10, 12, 8, 11])).toEqual({ first: 10, last: 11, low: 8, high: 12, changePercent: 10 });
  });

  it('returns null for no data', () => {
    expect(seriesStats([])).toBeNull();
  });
});

describe('formatRateDate', () => {
  it('formats API dates without shifting the day across time zones', () => {
    expect(formatRateDate('2026-10-16')).toContain('16');
    expect(formatRateDate('2026-10-16')).toContain('Oct');
  });

  it('returns the input when it is not a date', () => {
    expect(formatRateDate('not-a-date')).toBe('not-a-date');
  });
});

describe('formatPercent', () => {
  it('uses a decimal comma and drops the sign', () => {
    expect(formatPercent(0.987)).toBe('0,99%');
    expect(formatPercent(-12.5)).toBe('12,50%');
  });
});
