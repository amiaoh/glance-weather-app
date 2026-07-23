import { Box, Flex, Skeleton } from '@chakra-ui/react';
import { badgeSkeletonStyle, detailSkeletonStyle, iconSkeletonStyle, titleSkeletonStyle } from './GearCardSkeleton.styles';
import { cardStyle, headerStyle } from './GearCard.styles';

export function GearCardSkeleton() {
  return (
    <Box css={cardStyle}>
      <Flex css={headerStyle}>
        <Skeleton css={iconSkeletonStyle} />
        <Box flex={1}>
          <Skeleton css={titleSkeletonStyle} />
          <Skeleton css={detailSkeletonStyle} />
        </Box>
        <Skeleton css={badgeSkeletonStyle} />
      </Flex>
    </Box>
  );
}
