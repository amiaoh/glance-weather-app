import { WeatherTable } from './WeatherTable';
import { WeatherData } from '../../types/weather';

interface WeatherChartProps {
  data: WeatherData;
}

export function WeatherChart({ data }: WeatherChartProps) {
  return <WeatherTable data={data} />;
}
