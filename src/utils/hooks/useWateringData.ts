import { QueryFunction, useQuery, useQueryClient } from 'react-query';
import { WateringType } from '../../common/interfaces';
import { getWateringData } from '../requests/getWateringData';
import { useAuth0Token } from './useAuth0Token';

const loadWatering: QueryFunction<WateringType | undefined> = async ({
  queryKey,
}) => {
  const [, wateringId, token] = queryKey;
  if (!wateringId || !token) return undefined;
  const data = await getWateringData(wateringId, token);
  if (!data) {
    throw new Error('Bewässerungsvorgang nicht gefunden. Probiere einen anderen ...');
  }
  return data;
};

export const useWateringData = (
  wateringId: string | undefined | null,
): {
  wateringData: WateringType | undefined;
  error: Error | null;
  invalidate: () => void;
} => {
  const queryClient = useQueryClient();
  const token = useAuth0Token();

  if (wateringId === "watering-example-id") {
    return {
      wateringData: {
        amount: 15,
        updated: "2022-04-10T11:32:10.081Z",
        timestamp: "2022-04-08T09:15:10.081Z",
        treeId: "dummyTreeId",
        wateringId: "dummyWateringId",
        username: "dummyUsername",
        id: "dummyId"
      },
      error: null,
      invalidate: () => null,
    };
  } else {
    const wateringDataParams = [`watering-${wateringId}`, wateringId, token];
    const { data: wateringData, error } = useQuery<
      WateringType | undefined,
      Error
    >(wateringDataParams, loadWatering, {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    });

    return {
      wateringData,
      error,
      invalidate: () => {
        queryClient.invalidateQueries(wateringDataParams);
      },
    };
  }
};
