import { QueryFunction, useQuery } from 'react-query';
import { ExtendedFeatureCollection } from 'd3-geo';
import { loadWoodsData } from '../requests/loadWoodsData';

const loadData: QueryFunction = async (): Promise<ExtendedFeatureCollection> => {
  return await loadWoodsData();
};

export const useWoodsGeoJson = (): {
  data: ExtendedFeatureCollection | null;
  error: Error | null;
} => {
  const dataParams = 'woods-geojson';
  const { data, error } = useQuery<unknown, Error, ExtendedFeatureCollection>(
    dataParams,
    loadData,
    { staleTime: Infinity }
  );

  return {
    data: data || null,
    error: error || null,
  };
};
