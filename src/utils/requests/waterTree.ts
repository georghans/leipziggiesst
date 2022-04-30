import { createAPIUrl } from '../createAPIUrl';
import { requests } from '../requestUtil';

export const waterTree = async ({
  id,
  amount,
  timestamp,
  userId,
  username,
  token,
}: {
  id: string;
  amount: number;
  timestamp: string;
  userId: string;
  username: string;
  token: string;
}): Promise<void> => {
  const urlPostWatering = createAPIUrl(
    `/post?tree_id=${id}&amount=${amount}&timestamp=${timestamp}&uuid=${userId}&token=${token}&username=${username}&queryType=water`
  );

  await requests<undefined, { method: 'POST'; body: string }>(urlPostWatering, {
    token,
    override: {
      method: 'POST',
      body: JSON.stringify({
        tree_id: id,
        amount,
        timestamp,
        uuid: userId,
        username,
        queryType: 'water',
      }),
    },
  });
};
