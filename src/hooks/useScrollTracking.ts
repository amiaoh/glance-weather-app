import { useRef, useState, useEffect, useCallback } from 'react';

interface UseScrollTrackingOptions {
  columnWidth: number;
  labelColumnWidth: number;
  itemCount: number;
  initialIndex?: number;
}

export function useScrollTracking<T extends HTMLElement>({
  columnWidth,
  labelColumnWidth,
  itemCount,
  initialIndex = 0,
}: UseScrollTrackingOptions) {
  const scrollRef = useRef<T>(null);
  const [visibleIndex, setVisibleIndex] = useState(initialIndex);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const index = Math.floor((scrollLeft + labelColumnWidth) / columnWidth);
    const clampedIndex = Math.min(Math.max(0, index), itemCount - 1);

    setVisibleIndex(clampedIndex);
  }, [columnWidth, labelColumnWidth, itemCount]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollRef.current && index >= 0) {
      const scrollPosition = Math.max(0, index * columnWidth);
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [columnWidth]);

  return { scrollRef, visibleIndex, scrollToIndex };
}
