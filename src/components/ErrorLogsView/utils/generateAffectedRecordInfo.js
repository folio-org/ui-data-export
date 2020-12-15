import { capitalize } from 'lodash';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

const populateAffectedRecords = (records, result) => {
  if (!records) return;

  records.forEach(record => {
    const recordType = formatRecordType(record.recordType);

    result.push(`"Associated ${recordType} UUID": "${record.id}"`);
    result.push(`"Associated ${recordType} HRID": "${record.hrid}"`);

    generateHRIDIfInstanceRecord(record, result);
    populateAffectedRecords(record.affectedRecords, result);
  });
};

export const generateAffectedRecordInfo = affectedRecord => {
  const result = ['{'];
  const recordType = formatRecordType(affectedRecord.recordType);

  result.push(`"${recordType} UUID": "${affectedRecord.id}"`);
  result.push(`"${recordType} HRID": "${affectedRecord.hrid}"`);

  generateHRIDIfInstanceRecord(affectedRecord, result);
  populateAffectedRecords(affectedRecord.affectedRecords, result);

  result.push('}');

  return result;
};

const generateHRIDIfInstanceRecord = (affectedRecord, result) => {
  const { recordType } = affectedRecord;

  if (recordType === FOLIO_RECORD_TYPES.INSTANCE.type) {
    result.push(`"${formatRecordType(recordType)} Title": "${affectedRecord.title}"`);
  }
};

const formatRecordType = recordType => capitalize(recordType);
