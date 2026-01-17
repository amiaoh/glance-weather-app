import type { UVApiResponse } from './types';

export async function fetchUVData(city: string, date: string): Promise<UVApiResponse> {
  const params = new URLSearchParams({ city, date });
  const response = await fetch(`/api/uv?${params}`);

  if (!response.ok) {
    throw new Error(`UV API error: ${response.status}`);
  }

  return response.json();
}
