import { capitalize } from 'lodash';

function populateAffectedRecords(records, result) {
  if (!records) return;

  records.forEach(record => {
    const recordType = capitalize(record.recordType);

    result.push(`"Associated ${recordType} UUID": "${record.id}"`);
    result.push(`"Associated ${recordType} HRID": "${record.hrid}"`);

    populateAffectedRecords(record.affectedRecords, result);
  });
}

export function generateAffectedRecordInfo(affectedRecord) {
  const result = ['{'];

  const recordType = capitalize(affectedRecord.recordType);

  result.push(`"${recordType} UUID": "${affectedRecord.id}"`);
  result.push(`"${recordType} HRID": "${affectedRecord.hrid}"`);
  result.push(`"${recordType} Title": "${affectedRecord.title}"`);

  populateAffectedRecords(affectedRecord.affectedRecords, result);

  result.push('}');

  return result;
}
