import { Box, Flex, Text } from "@chakra-ui/react";
import { findMaxTemp, getTodayRemainingHours } from './forecast.utils';

import { useMemo } from "react";
import type { WeatherData } from "../../types/weather";
import { formatHour } from "./formatters";
import { getWeatherInfo } from "../../utils/weatherCodeMapper";
import { WeatherIcon } from "./WeatherIcon";
import { descriptionStyle, dividerStyle, stripStyle, tempStyle } from './WeatherMain.styles';

interface WeatherMainProps {
  data: WeatherData;
}

export function WeatherMain({ data }: WeatherMainProps) {
  const currentHour = data.hourly[0];

  const maxTemp = useMemo(() => {
    const remainingToday = getTodayRemainingHours(data.hourly);
    return findMaxTemp(remainingToday);
  }, [data.hourly]);
  const isMaxTempPast = !maxTemp || maxTemp.value <= currentHour.temperature;

  const description = getWeatherInfo(currentHour.weatherCode, currentHour.isDay).description;

  return (
    <Box p="var(--padding-sm)">
      <Flex css={stripStyle}>
        <Box flexShrink={0}>
          <WeatherIcon code={currentHour.weatherCode} isDay={currentHour.isDay} size={19} />
        </Box>
        <Text css={tempStyle}>{Math.round(currentHour.temperature)}°</Text>
        <Text>now</Text>

        {!isMaxTempPast && maxTemp && (
          <>
            <Text css={dividerStyle}>·</Text>
            <Text css={tempStyle}>{Math.round(maxTemp.value)}°</Text>
            <Text>{`at ${formatHour(maxTemp.time)}`}</Text>
          </>
        )}

        <Text css={descriptionStyle}>{description}</Text>
      </Flex>
    </Box>
  );
}
