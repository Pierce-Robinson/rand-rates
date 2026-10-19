import { filterCurrencies } from '@/utils/search';

const names = { USD: 'United States Dollar', EUR: 'Euro', GBP: 'British Pound', AUD: 'Australian Dollar' };
const codes = Object.keys(names);

describe('filterCurrencies', () => {
  it('lists favourites first, then the rest alphabetically', () => {
    expect(filterCurrencies(codes, names, '', ['USD'])).toEqual(['USD', 'AUD', 'EUR', 'GBP']);
  });

  it('matches codes and names, ignoring case', () => {
    expect(filterCurrencies(codes, names, 'dollar')).toEqual(['AUD', 'USD']);
    expect(filterCurrencies(codes, names, 'gb')).toEqual(['GBP']);
  });

  it('returns nothing when no currency matches', () => {
    expect(filterCurrencies(codes, names, 'zzz')).toEqual([]);
  });
});
