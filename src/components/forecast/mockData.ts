import { RainLevel, WindLevel } from '../../types/weather';

const mockAlerts = {
  uvAlert: { uvValue: 9, alertTime: new Date(Date.now() + 2 * 60 * 60 * 1000) },
  rainAlert: { totalMm: 4.2, alertTime: new Date(Date.now() + 1 * 60 * 60 * 1000), precipitationProbability: 80, weatherCode: 95, isDay: true, level: "light" as RainLevel },
  windAlert: { speed: 45, alertTime: new Date(Date.now() + 3 * 60 * 60 * 1000), level: "strong" as WindLevel },
};

const mockCurrentHour = {
  temperature: 24,
  weatherCode: 2,
  isDay: true,
  uvIndex: 6,
};

const mockMaxTemp = {
  value: 32,
  time: new Date(Date.now() + 3 * 60 * 60 * 1000),
  weatherCode: 0,
  isDay: true,
};

const mockMaxUV = {
  value: 9,
  time: new Date(Date.now() + 2 * 60 * 60 * 1000),
};

export { mockAlerts, mockCurrentHour, mockMaxTemp, mockMaxUV };
