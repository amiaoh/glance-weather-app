export interface CityData {
  name: string;
  state: string;
  lat: number;
  lng: number;
  arpansaName: string;
  timezone: string;
}

export const AUSTRALIAN_CITIES: CityData[] = [
  { name: 'Sydney', state: 'NSW', lat: -33.8688, lng: 151.2093, arpansaName: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Melbourne', state: 'VIC', lat: -37.8136, lng: 144.9631, arpansaName: 'Melbourne', timezone: 'Australia/Melbourne' },
  { name: 'Brisbane', state: 'QLD', lat: -27.4698, lng: 153.0251, arpansaName: 'Brisbane', timezone: 'Australia/Brisbane' },
  { name: 'Perth', state: 'WA', lat: -31.9505, lng: 115.8605, arpansaName: 'Perth', timezone: 'Australia/Perth' },
  { name: 'Adelaide', state: 'SA', lat: -34.9285, lng: 138.6007, arpansaName: 'Adelaide', timezone: 'Australia/Adelaide' },
  { name: 'Gold Coast', state: 'QLD', lat: -28.0167, lng: 153.4000, arpansaName: 'Gold Coast', timezone: 'Australia/Brisbane' },
  { name: 'Newcastle', state: 'NSW', lat: -32.9283, lng: 151.7817, arpansaName: 'Newcastle', timezone: 'Australia/Sydney' },
  { name: 'Canberra', state: 'ACT', lat: -35.2809, lng: 149.1300, arpansaName: 'Canberra', timezone: 'Australia/Sydney' },
  { name: 'Darwin', state: 'NT', lat: -12.4634, lng: 130.8456, arpansaName: 'Darwin', timezone: 'Australia/Darwin' },
  { name: 'Townsville', state: 'QLD', lat: -19.2590, lng: 146.8169, arpansaName: 'Townsville', timezone: 'Australia/Brisbane' },
  { name: 'Alice Springs', state: 'NT', lat: -23.6980, lng: 133.8807, arpansaName: 'Alice Springs', timezone: 'Australia/Darwin' },
  { name: 'Hobart', state: 'TAS', lat: -42.8821, lng: 147.3272, arpansaName: 'Kingston', timezone: 'Australia/Hobart' },
  { name: 'Emerald', state: 'QLD', lat: -23.5275, lng: 148.1617, arpansaName: 'Emerald', timezone: 'Australia/Brisbane' },
];

export const DEFAULT_CITY = AUSTRALIAN_CITIES.find(c => c.name === 'Melbourne')!;

export function getCityByName(name: string): CityData | undefined {
  return AUSTRALIAN_CITIES.find(c => c.name === name);
}
