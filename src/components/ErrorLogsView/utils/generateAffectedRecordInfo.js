import React from 'react';
import { capitalize } from 'lodash';

import { TextLink } from '@folio/stripes/components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

const formatRecordType = recordType => capitalize(recordType);

const generateAffectedRecordLevel = ({
  record,
  formatMessage,
  isAssociatedRecord = false,
}) => {
  const affectedRecordLevel = [];
  const recordType = formatRecordType(record.recordType);
  const messageIdPrefix = `ui-data-export.errorLogs.record${isAssociatedRecord ? 'Associated' : ''}`;

  affectedRecordLevel.push(formatMessage(
    { id: `${messageIdPrefix}.UUID` },
    {
      value: record.id,
      recordType,
    }
  ));
  affectedRecordLevel.push(formatMessage(
    { id: `${messageIdPrefix}.HRID` },
    {
      value: record.hrid,
      recordType,
    }
  ));

  if (record.recordType === FOLIO_RECORD_TYPES.INSTANCE.type) {
    affectedRecordLevel.push(formatMessage(
      { id: `${messageIdPrefix}.Title` },
      {
        value: record.title,
        recordType,
      }
    ));
  }

  if (record.inventoryRecordLink) {
    affectedRecordLevel.push(
      <>
        {formatMessage({ id: 'ui-data-export.errorLogs.inventoryRecordLink' })}
        <TextLink
          href={record.inventoryRecordLink}
          target="_blank"
          data-testId="record-link"
        >
          {record.inventoryRecordLink}
        </TextLink>
      </>
    );
  }

  return affectedRecordLevel;
};

const populateAffectedRecords = ({
  records,
  affectedRecordInfo,
  formatMessage,
}) => {
  if (!records) return;

  records.forEach(record => {
    affectedRecordInfo.push(...generateAffectedRecordLevel({
      record,
      isAssociatedRecord: true,
      formatMessage,
    }));
    populateAffectedRecords({
      records: record.affectedRecords,
      affectedRecordInfo,
      formatMessage,
    });
  });
};

export const generateAffectedRecordInfo = (affectedRecord, formatMessage) => {
  const affectedRecordInfo = ['{'];

  affectedRecordInfo.push(...generateAffectedRecordLevel({
    record: affectedRecord,
    formatMessage,
  }));
  populateAffectedRecords({
    records: affectedRecord.affectedRecords,
    affectedRecordInfo,
    formatMessage,
  });

  affectedRecordInfo.push('}');

  return affectedRecordInfo;
};



