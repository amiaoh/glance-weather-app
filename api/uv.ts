import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetchUVData from 'arpansa-uv-data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { city, date } = req.query;

  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'Missing city parameter' });
  }

  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'Missing date parameter' });
  }

  try {
    const uvData = await fetchUVData({
      location: city,
      date: new Date(date),
    });

    // Transform to hourly data for easier consumption
    const hourlyData = uvData
      .filter((_, index) => index % 60 === 0) // Get one reading per hour
      .map(entry => ({
        time: entry.timestamp,
        uvIndex: entry.forecast ?? entry.measured ?? 0,
      }));

    return res.status(200).json({
      city,
      date,
      data: hourlyData,
    });
  } catch (error) {
    console.error('UV data fetch error:', error);
    return res.status(500).json({
      error: 'Failed to fetch UV data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
