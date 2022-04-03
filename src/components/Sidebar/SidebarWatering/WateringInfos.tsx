import React, { FC, useState } from 'react';
import EasyEdit, {Types} from 'react-easy-edit';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import Done from '@material-ui/icons/Done'
import Close from '@material-ui/icons/Close'
import Pencil from '@material-ui/icons/Edit'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from  "react-datepicker";
import de from 'date-fns/locale/de';

import { WateringType } from '../../../common/interfaces';
import TreeButton from '../../TreeButton';

import { useCanUpdateWatering } from '../../../utils/hooks/useCanUpdateWatering';
import { useWateringActions } from '../../../utils/hooks/useWateringActions';
import { formatUnixTimestamp } from '../../../utils/formatUnixTimestamp';

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
  font-size: ${p => p.theme.fontSizeL};
  margin: 0 0 4px;
`;

const EditField = ({ index, prefix, value, save }) => {
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
            type={Types.TEXT}
            onSave={async val => {
              setLoading(true);
              await save(val);
              setDisplayValue(val);
              setLoading(false);
            }}
            saveButtonLabel={<Done style={{ fontSize: 14 }} />}
            cancelButtonLabel={<Close style={{ fontSize: 14 }} />}
            attributes={{ id: `edit-${prefix}-${index}` }}
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
  registerLocale('de', de)
  const history = useHistory();
  const { isUpdatingWatering, updateWatering } = useWateringActions(null);
  const {
    amount,
    updated,
    timestamp,
    username,
    treeId,
    wateringId,
  } = selectedWateringData;
  const canUpdateWatering = useCanUpdateWatering(wateringId);
  const [amountToShow, setAmountToShow] = useState(amount)
  const [dateToShow, setDateToShow] = useState(new Date(Date.parse(timestamp)))

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
              {(canUpdateWatering && !isUpdatingWatering) ?
                <EditField
                  value={amountToShow}
                  save={async (value) => {
                    await updateWatering(wateringId, "amount", value);
                    setAmountToShow(value);
                  }}
                  prefix={"req"}
                  key={`edit-req-0-key`}
                  index={0}
                /> : amountToShow
              }
            </InfoValue>
          </InfoContainer>
        )}
        {timestamp && (
          <>
            <span><b>Gegossen am</b></span>
            <InfoContainer>
              <InfoValue>
                <DatePicker
                  locale={"de"}
                  dateFormat={"dd. MMM yyyy"}
                  showTimeSelect={"showTimeSelect"}
                  minDate={new Date(1640991600000)}
                  onChange={(value: Date) =>
                    value && updateWatering(wateringId, "timestamp",
                      "" + value.toISOString()).finally(() => setDateToShow(value))}
                  selected={dateToShow} />
              </InfoValue>
            </InfoContainer>
          </>
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
