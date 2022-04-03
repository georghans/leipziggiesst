import { requests } from '../requestUtil';
import { createAPIUrl } from '../createAPIUrl';

export const canUpdateWatering = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<boolean> => {
  const apiUrl = createAPIUrl(
    `/get?queryType=canupdatewatering&id=${id}`
  );

  const res = await requests<{ data: boolean }>(apiUrl, { token });
  return res.data;
};