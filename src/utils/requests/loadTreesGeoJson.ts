import { dsv as d3Dsv, GeoGeometryObjects } from 'd3';
import { ExtendedFeatureCollection, ExtendedFeature } from 'd3-geo';
import { Tree, TreeGeojsonFeatureProperties } from '../../common/interfaces';

var isLocalTesting = process.env.LOCAL_TESTING;

function createGeojson(trees: Tree[]): ExtendedFeatureCollection {
  const geojson: ExtendedFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  trees.forEach(tree => {
    const feature: ExtendedFeature<
      GeoGeometryObjects | null,
      TreeGeojsonFeatureProperties
    > = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          parseFloat(tree?.lng || '0'),
          parseFloat(tree?.lat || '0'),
        ],
      },
      /**
       * Apparently DWD 1 is not 1ml but 0.1ml
       * We could change this in the database, but this would mean,
       * transferring 625.000 "," characters, therefore,
       * changing it client-side makes more sense.
       */
      properties: {
        id: tree.id,
        radolan_sum: (tree?.radolan_sum || 0) / 10,
        age: tree?.age ? parseInt(tree.age) : undefined,
      },
    };
    geojson.features.push(feature);
  });

  return geojson;
}

export const loadTreesGeoJson = async (): Promise<ExtendedFeatureCollection> => {
  console.log('LOCAL TESTING', isLocalTesting);
  console.log('data url', process.env.TREE_DATA_URL);
  if (false) {
    // http://localhost:8080/tree/id-9135
    const data = [
      {
        id: 'id-9135',
        lng: 12.346080918353433,
        lat: 51.328492865964243,
        radolan_sum: 820,
        age: 5,
      },
      {
        id: '4110',
        lng: 12.321279644966125,
        lat: 51.320883607664406,
        radolan_sum: 820,
        age: 0,
      },
      {
        id: '3203',
        lng: 12.476344000378111,
        lat: 51.424873921079637,
        radolan_sum: 820,
        age: undefined,
      },
    ];
    const geojson = createGeojson((data as unknown) as Tree[]);
    return geojson;
  } else {
    const dataUrl = process.env.TREE_DATA_URL || '/data/trees.csv.gz';
    const data = await d3Dsv(',', dataUrl, { cache: 'force-cache' });
    const geojson = createGeojson((data as unknown) as Tree[]);
    return geojson;
  }
};
