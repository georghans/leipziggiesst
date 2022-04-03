import { RawWateringType, WateringType } from '../../common/interfaces';
import { createAPIUrl } from '../createAPIUrl';
import { requests } from '../requestUtil';
import { parseRawWatering } from '../parsing/parseRawWaterings';

export const getWateringData = async (
  id: string,
  token: string
): Promise<WateringType | undefined> => {
  const url = createAPIUrl(`/get?queryType=watering&id=${id}`);
  const result = await requests<{ data?: RawWateringType }>(url, { token });

  if (result.data === undefined) {
    throw new Error('data is not defined on getWatering');
  }
  return result.data && parseRawWatering(result.data);
};
