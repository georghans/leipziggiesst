import { useLocation } from 'react-router';

const parseWateringIdParam = (path: string): string | null => {
  const [location, wateringId] = path
    .replace(/\?.*$/g, '')
    .split('/')
    .filter((text: string) => Boolean(text));
  return (location === 'watering' && wateringId) || null;
};

export const useCurrentWateringId = (): string | null => {
  const { pathname } = useLocation();
  return parseWateringIdParam(pathname);
};
