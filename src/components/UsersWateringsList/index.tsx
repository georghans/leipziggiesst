import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Delete from '@material-ui/icons/Delete'
import Pencil from '@material-ui/icons/Edit'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useHistory } from 'react-router';
import { WateringType } from '../../common/interfaces';
import { useCanUpdateWaterings } from '../../utils/hooks/useCanUpdateWaterings';
import { useWateringActions } from '../../utils/hooks/useWateringActions';
import useClickOutside from '../../utils/hooks/useClickOutside';
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp';
import SmallParagraph from '../SmallParagraph';
import TreeButton from '../TreeButton';

const iconDrop = '/images/icon-drop.svg';

const StyledTreeType = styled(SmallParagraph)`
  padding: 0;
  padding-left: 5px;
`;

const StyledIcon = styled.img`
  margin-left: 5px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 25px;
  align-items: center;
  justify-content: space-between;
`;

const WrapperOuter = styled.div`
  padding-top: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const FlexRow = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: row;
`;

const Title = styled.h3`
  height: fit-content;
  font-weight: normal;
  font-size: ${p => p.theme.fontSizeL};
`;

const ToggleExpansionLink = styled.button`
  border: 0;
  background: none;
  margin: 0;
  padding: 0;
  text-align: left;
  font-family: inherit;
  font-size: ${p => p.theme.fontSizeL};
  color: ${p => p.theme.colorTextDark};
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
  padding: 8px;
  transition: color 200ms ease-out;
  outline: none;

  &:hover {
    color: ${p => p.theme.colorTextLight};
  }

  &:focus {
    border-radius: 3px;
    box-shadow: 0 0 0 2px ${p => p.theme.colorTextLight};
  }
`;

const MAX_ITEMS = 8;

interface WateringRowPropTypes extends WateringType {
  showTreeName: boolean;
  canUpdateWatering: boolean;
}

const WateringRow: FC<WateringRowPropTypes> = ({
  username,
  timestamp,
  amount,
  treeId,
  wateringId,
  showTreeName,
  canUpdateWatering,
}) => {
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteWatering } = useWateringActions(treeId);
  const elRef = useClickOutside<HTMLDivElement>(() => setIsDeleting(false));

  const escListener = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDeleting(false);
    }
  }, []);

  useEffect(() => {
    if (!isDeleting) {
      document.removeEventListener('keyup', escListener);
    }
    document.addEventListener('keyup', escListener);
    return () => document.removeEventListener('keyup', escListener);
  }, [isDeleting, escListener]);

  if (isDeleting) return (
    <div style={{ width: "100%" }}>
      <Loader type="ThreeDots" color="#37DE8A" height={20} width={40} />
    </div>
  )
  return (
    <Wrapper key={`Lastadopted-key-${wateringId}`}  style={{ height: showTreeName ? "40px": "25px"}} ref={elRef}>
      <FlexRow>
        { showTreeName ? <TreeButton
          key={treeId}
          label={treeId}
          onClickHandler={() => {
            history.push(`/tree/${treeId}`);
          }}
        /> : (
          <Title>{username}</Title>
        )}
        <StyledTreeType>({formatUnixTimestamp(timestamp)})</StyledTreeType>
      </FlexRow>
      <SmallParagraph>{`${amount}l`}</SmallParagraph>
      <StyledIcon src={iconDrop} alt='Water drop icon' />
      { canUpdateWatering && !isDeleting && (
        <div onClick={() => history.push(`/watering/${wateringId}`)} style={{ paddingLeft: '10px', cursor: 'pointer' }}>
          <Pencil style={{ fontSize: 14 }} />
        </div>
      )}
      { canUpdateWatering && !isDeleting && (
        <div onClick={() => {
          setIsDeleting(true);
          try {
            deleteWatering(wateringId);
          } catch(e) {
            setIsDeleting(false);
          }
        }} style={{ paddingLeft: '2px', cursor: 'pointer' }}>
          <Delete style={{ fontSize: 14 }} />
        </div>
      )}
    </Wrapper>
  );
};

const UsersWateringsList: FC<{
  waterings: WateringType[];
  showTreeName: boolean,
}> = ({ waterings, showTreeName }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const surpassedMaxItems = waterings.length > MAX_ITEMS;
  const sortWaterings = (t1: WateringType, t2: WateringType) => t2.timestamp.localeCompare(t1.timestamp); 
  const listItems = isExpanded ? waterings : waterings.sort(sortWaterings).slice(0, MAX_ITEMS);
  const canUpdateWaterings = useCanUpdateWaterings(listItems.map(item => item.wateringId));

  return (
    <WrapperOuter>
    {listItems.map(entry => (
      <WateringRow
        key={entry.wateringId}
        {...entry}
        treeId={entry.treeId}
        canUpdateWatering={canUpdateWaterings.canUpdateWaterings
          && canUpdateWaterings.canUpdateWaterings[entry.wateringId]}
        showTreeName={showTreeName}
      />
    ))}
      {surpassedMaxItems && (
        <ToggleExpansionLink onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded
            ? 'Weniger anzeigen'
            : `${
                waterings.length - MAX_ITEMS
              } zusätzliche Bewässerungen anzeigen`}
        </ToggleExpansionLink>
      )}
    </WrapperOuter>
  );
};

export default UsersWateringsList;
