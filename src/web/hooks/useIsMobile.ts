import { useWindowSize } from 'react-use';

/**
 * 判定是否为移动版网页
 */
export function useIsMobile(): boolean {
  const { width } = useWindowSize();

  return width < 768;
}
