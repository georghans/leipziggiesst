import React, { FC } from 'react';
import SidebarTitle from '../SidebarTitle';
import WateringInfos from './WateringInfos';
import LoadingIcon, { SidebarLoadingContainer } from '../../LoadingIcon';
import { useCurrentWateringId } from '../../../utils/hooks/useCurrentWateringId';
import { useWateringData } from '../../../utils/hooks/useWateringData';
import { ImprintAndPrivacy } from '../../ImprintAndPrivacy';
import { SidebarLoading } from '../SidebarLoading';

const SidebarWatering: FC<{ isLoading?: boolean }> = ({
  isLoading: isLoadingProps,
}) => {
  const wateringId = useCurrentWateringId();
  const { wateringData: selectedWateringData, error } = useWateringData(wateringId);
  const isLoadingState = !error && !selectedWateringData;
  const isLoading = isLoadingProps || isLoadingState || false;

  if (isLoading) return <SidebarLoading title='Bewässerungsvorgang' />;

  return (
    <>
      <SidebarTitle>Bewässerungsvorgang</SidebarTitle>
      {!isLoading && selectedWateringData && (
        <WateringInfos selectedWateringData={selectedWateringData} />
      )}
      {error && (
        <>
          <SidebarLoadingContainer>
            <LoadingIcon text={error.message} hasError={!!error} />
            <ImprintAndPrivacy />
          </SidebarLoadingContainer>
        </>
      )}
    </>
  );
};

export default SidebarWatering;
