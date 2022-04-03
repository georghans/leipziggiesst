import { createAPIUrl } from '../createAPIUrl';
import { requests } from '../requestUtil';

export const updateWatering = async ({
  token,
  wateringId,
  field,
  value,
}: {
  token: string;
  wateringId: string;
  field: string;
  value: string;
}): Promise<boolean> => {
  const urlWaterings = createAPIUrl(`/post`);
  await requests<undefined, { method: 'POST'; body: string }>(urlWaterings, {
    token,
    override: {
      method: 'POST',
      body: JSON.stringify({
        queryType: 'watering-update',
        watering_id: wateringId,
        patches: [{
          name: field,
          value: value
        }]
      }),
    },
  });
  return true;
};
