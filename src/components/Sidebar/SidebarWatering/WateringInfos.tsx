import React, { FC, useState } from 'react';
import EasyEdit, {Types} from 'react-easy-edit';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import Done from '@material-ui/icons/Done'
import Close from '@material-ui/icons/Close'
import Pencil from '@material-ui/icons/Edit'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { DatePickerDialog } from '../../DatePickerDialog';
import { WateringType } from '../../../common/interfaces';
import TreeButton from '../../TreeButton';

import { useCanUpdateWaterings } from '../../../utils/hooks/useCanUpdateWaterings';
import { useWateringActions } from '../../../utils/hooks/useWateringActions';
import { formatUnixTimestamp } from '../../../utils/formatUnixTimestamp';

import "./easyedit-custom.css";

const Wrapper = styled.div`
  z-index: 3;
  margin: 0 0 20px;
`;

const FlexColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${p => p.theme.colorGreyLight};
  padding: 12px 0;
  font-weight: bold;
`;

const InfoValue = styled.span`
  font-weight: normal;
`;

const CredentialValue = styled.p`
  display: block;
  font-size: ${p => p.theme.fontSizeLl};
  margin: 0 0 4px;
`;

const getRealisticDate = (wateringDate: Date): Date => {
  const currentHours = new Date().getHours();
  // NOTE: We force the watering date to be in the afternoon instead of at 00:00:00 to avoid involuntary date changes:
  return wateringDate.getHours() <= 3
    ? new Date(wateringDate.setHours(currentHours <= 3 ? 15 : currentHours))
    : wateringDate;
}

const DateField = ({ prefix, value, save }) => {
  const [loading, setLoading] = useState(false);
  const parsed = timestampValue => {
    if (!timestampValue) return null;
    try {
      return new Date(Date.parse(timestampValue))
    } catch(e) {
      return null;
    }
  }
  const [displayValue, setDisplayValue] = useState(parsed(value));

  return (
    <>
      { (loading || !displayValue) && (
        <div style={{ width: "100%" }}>
          <Loader type="ThreeDots" color="#37DE8A" height={20} width={40} />
        </div>
      )}
      {(!loading && displayValue) && (
        <DatePickerDialog
          id={`watering-date-${prefix}`}
          defaultDate={new Date()}
          value={displayValue}
          onDateChange={async val => {
            const realistic = val && getRealisticDate(val);
            if (realistic == displayValue) return;
            setLoading(true);
            await save(realistic.toISOString())
            setDisplayValue(realistic);
            setLoading(false);
          }}
        />
      )}
    </>
  );
}

const EditField = ({ prefix, value, save }) => {
  const [loading, setLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  return (
    <div style={{ paddingBottom: "5px" }}>
      <CredentialValue>
        { loading && (
          <div style={{ width: "100%" }}>
            <Loader type="ThreeDots" color="#37DE8A" height={20} width={40} />
          </div>
        )}
        {!loading && (
          <EasyEdit
            cssClassPrefix={'watering-'}
            type={Types.TEXT}
            onSave={async val => {
              setLoading(true);
              await save(val);
              setDisplayValue(val);
              setLoading(false);
            }}
            saveButtonLabel={<Done style={{ fontSize: 14 }} />}
            cancelButtonLabel={<Close style={{ fontSize: 14 }} />}
            attributes={{ id: `edit-${prefix}` }}
            displayComponent={<>
              <div style={{ float: "left"}}>{displayValue || ""}</div>
              <Pencil style={{ paddingLeft: "5px", fontSize: 14 }} />
            </>}
            value={displayValue}
          />
        )}
      </CredentialValue>
    </div>
  )
}

const WateringInfos: FC<{
  selectedWateringData: WateringType;
}> = ({ selectedWateringData }) => {
  const history = useHistory();
  const {
    amount,
    updated,
    timestamp,
    username,
    treeId,
    wateringId,
  } = selectedWateringData;
  const { updateWatering } = useWateringActions(treeId);
  const canUpdateWaterings = useCanUpdateWaterings([wateringId]);

  return (
    <Wrapper>
      <FlexColumnDiv>
        {username && (
          <InfoContainer>
            <span>Gegossen von</span>
            <InfoValue>{username}</InfoValue>
          </InfoContainer>
        )}
        {treeId && (
          <InfoContainer>
          <span>Gegossener Baum</span>
          <InfoValue>
            <TreeButton
                key={treeId}
                label={treeId}
                onClickHandler={() => {
                  history.push(`/tree/${treeId}`);
                }}
              />
            </InfoValue>
          </InfoContainer>
        )}
        {amount && (
          <InfoContainer>
            <span>Gegossene Liter</span>
            <InfoValue>
              {(canUpdateWaterings.canUpdateWaterings && canUpdateWaterings.canUpdateWaterings[wateringId]) ?
                <EditField
                  value={amount}
                  save={val => updateWatering(wateringId, "amount", val)}
                  prefix={`watering-amount-${wateringId}`}
                  key={`edit-watering-amount-${wateringId}`}
                /> : amount
              }
            </InfoValue>
          </InfoContainer>
        )}
        {timestamp && (
          <div style={{ marginTop: '10px' }}>
            <span><b>Gegossen am</b></span>
            <DateField
                value={timestamp}
                save={val => updateWatering(wateringId, "timestamp", val)}
                prefix={`watering-timestamp-${wateringId}`}
                key={`edit-watering-timestamp-${wateringId}`}
            />
            <hr style={{ borderWidth: '1px 0 0 0', borderStyle: 'solid', borderColor: '#E6E6E6' }} />
          </div>
        )}
        {updated && (
          <InfoContainer>
            <span>Zuletzt aktualisiert</span>
            <InfoValue>{formatUnixTimestamp(updated)}</InfoValue>
          </InfoContainer>
        )}
      </FlexColumnDiv>
    </Wrapper>
  );
};

export default WateringInfos;
