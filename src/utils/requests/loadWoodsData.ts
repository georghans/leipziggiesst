import { ExtendedFeatureCollection } from 'd3-geo';
import { requests } from '../requestUtil';

export const loadWoodsData = async (): Promise<ExtendedFeatureCollection> => {
  return await requests<ExtendedFeatureCollection>(
    '/data/woods.json'
  );
};
