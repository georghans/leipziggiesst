import { RawWateringType, WateringType } from '../../common/interfaces';

export const parseRawWatering = (rawWatering: RawWateringType): WateringType => ({
  id: `watering-${rawWatering.id}`,
  amount: parseFloat(rawWatering.amount),
  timestamp: rawWatering.timestamp,
  updated: rawWatering.updated,
  treeId: rawWatering.tree_id,
  username: rawWatering.username,
  wateringId: rawWatering.watering_id,
});

export const parseRawWaterings = (
  rawWaterings: RawWateringType[]
): WateringType[] => rawWaterings.map(parseRawWatering).reverse();
