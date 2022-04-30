import { QueryFunction, useQuery, useQueryClient } from 'react-query';
import { canUpdateWaterings } from '../requests/canUpdateWaterings';
import { useAuth0Token } from './useAuth0Token';

const fetchCanUpdateWaterings: QueryFunction<Map<string, boolean | undefined> | undefined> = async ({
  queryKey,
}) => {
  const [, ids, token] = queryKey;
  if (!token || !ids) return undefined;
  return canUpdateWaterings({ ids, token });
};

export const useCanUpdateWaterings = (ids: string[]): {
  canUpdateWaterings: Map<string, boolean | undefined> | undefined;
  error: Error | null;
  invalidate: () => void;
} => {
  const token = useAuth0Token();
  const queryClient = useQueryClient();

  const queryParams = ['canUpdateWaterings', ids, token];
  const { data: canUpdateWaterings, error } = useQuery<
    Map<string, boolean | undefined> | undefined,
    Error | null
  >(queryParams, fetchCanUpdateWaterings, { staleTime: Infinity });

  return {
    canUpdateWaterings,
    error,
    invalidate: () => queryClient.invalidateQueries(queryParams),
  };
};
