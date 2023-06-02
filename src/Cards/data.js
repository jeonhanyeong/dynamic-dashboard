const energySources = [
  { value: 'Billing', name: 'Billing' },
  { value: 'SalesOps', name: 'SalesOps' },
  { value: 'colson', name: 'colson' },
  { value: 'iam', name: 'iam' },
  { value: 'matecdn_back', name: 'matecdn_back' },
  { value: 'matecdn_front', name: 'matecdn_front' },
];

const countriesInfo = [
  {
    country: '2022-05-11',
    Billing: 71.2,
    SalesOps: 910.4,
    colson: 483.2,
    iam: 564.3,
    matecdn_back: 216.1,
    matecdn_front: 216.1,
  },
  {
    country: 'China',
    hydro: 72.5,
    oil: 223.6,
    gas: 36,
    coal: 956.9,
    nuclear: 11.3,
  },
  {
    country: 'Russia',
    hydro: 47.7,
    oil: 149.4,
    gas: 432.3,
    coal: 105,
    nuclear: 29.3,
  },
  {
    country: 'Japan',
    hydro: 17.9,
    oil: 283.6,
    gas: 61.8,
    coal: 120.8,
    nuclear: 52.8,
  },
  {
    country: 'India',
    hydro: 14.4,
    oil: 86.4,
    gas: 25.1,
    coal: 204.8,
    nuclear: 3.8,
  },
  {
    country: 'Germany',
    hydro: 6.6,
    oil: 101.7,
    gas: 92.7,
    coal: 85.7,
    nuclear: 30.8,
  },
];

export default {
  getEnergySources() {
    return energySources;
  },
  getCountriesInfo() {
    return countriesInfo;
  },
};

export const dataSource = [
  {
    day: 'Monday',
    oranges: 3,
  },
  {
    day: 'Tuesday',
    oranges: 2,
  },
  {
    day: 'Wednesday',
    oranges: 3,
  },
  {
    day: 'Thursday',
    oranges: 4,
  },
  {
    day: 'Friday',
    oranges: 6,
  },
  {
    day: 'Saturday',
    oranges: 11,
  },
  {
    day: 'Sunday',
    oranges: 4,
  },
];
