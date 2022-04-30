import { useState } from 'react';
import { waterTree } from '../requests/waterTree';
import { deleteWatering } from '../requests/deleteWatering';
import { updateWatering } from '../requests/updateWatering';
import { useAuth0Token } from './useAuth0Token';
import { useCommunityData } from './useCommunityData';
import { useWateringData } from './useWateringData';
import { useTreeData } from './useTreeData';
import { useUserData } from './useUserData';

export const useWateringActions = (
  treeId: string | null | undefined,
): {
  waterTree: (amount: number, timestamp: string) => Promise<void>;
  deleteWatering: (uuid: string) => Promise<void>;
  updateWatering: (uuid: string, field: string, value: string) => Promise<void>;
  isBeingWatered: boolean;
  isUpdatingWatering: boolean;
} => {
  const token = useAuth0Token();
  const { userData, invalidate: invalidateUserData } = useUserData();
  const { invalidate: invalidateCommunityData } = useCommunityData();
  const { invalidate: invalidateTreeData } = useTreeData(treeId);
  const { invalidateWatering } = useWateringData(null);
  const [isBeingWatered, setIsBeingWatered] = useState<boolean>(false);
  const [isUpdatingWatering, setIsUpdatingWatering] = useState<boolean>(false);

  return {
    isBeingWatered,
    isUpdatingWatering,
    waterTree: async (amount: number, timestamp: string): Promise<void> => {
      if (!userData || !token || !treeId) return;

      setIsBeingWatered(true);
      await waterTree({
        id: treeId,
        token,
        amount,
        timestamp,
        userId: userData.id,
        username: userData.userProfile?.prefered_username || userData.username,
      });
      invalidateUserData();
      invalidateTreeData();
      invalidateCommunityData();
      setIsBeingWatered(false);
    },
    deleteWatering: async (wateringId: string): Promise<void> => {
      if (!userData || !token) return;

      setIsUpdatingWatering(true);
      await deleteWatering({ token, wateringId });
      invalidateUserData();
      invalidateTreeData();
      invalidateCommunityData();
      invalidateWatering(wateringId);
      setIsUpdatingWatering(false);
    },
    updateWatering: async (wateringId: string, field: string, value: string): Promise<void> => {
      if (!userData || !token || !field) return;

      setIsUpdatingWatering(true);
      await updateWatering({ token, wateringId, field, value })
      invalidateUserData();
      invalidateTreeData();
      invalidateCommunityData();
      invalidateWatering(wateringId);
      setIsUpdatingWatering(false);
    }
  };
};
