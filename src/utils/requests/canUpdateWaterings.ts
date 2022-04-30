import { requests } from '../requestUtil';
import { createAPIUrl } from '../createAPIUrl';

export const canUpdateWaterings = async ({
  ids,
  token,
}: {
  ids: string[];
  token: string;
}): Promise<Map<string, boolean | undefined>> => {
  const url = createAPIUrl(`/post`);

  const res = await requests<{
    data: Map<string, boolean | undefined>;
  }>(url, {
    token,
    override: {
      method: 'POST',
      body: JSON.stringify({ ids, queryType: 'canupdatewaterings' }),
    },
  });

  return res.data;
};