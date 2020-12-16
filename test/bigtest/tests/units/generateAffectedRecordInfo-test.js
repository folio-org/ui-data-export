import {
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import { useIntl } from 'react-intl';

import { getHookExecutionResult } from '@folio/stripes-data-transfer-components/interactors';

import { generateAffectedRecordInfo } from '../../../../src/components/ErrorLogsView/utils';
import { translationsProperties } from '../../../helpers';
import { errorLogs } from '../../fixtures/errorLogs';

const useGenerateAffectedRecordInfo = ({ logs }) => {
  const intl = useIntl();

  return { recordInfo: generateAffectedRecordInfo(logs, intl.formatMessage) };
};

describe('generateAffectedRecordInfo', () => {
  it('should return correct record info with no nesting', () => {
    const logs = {
      id: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
      hrid: 'inst000000000022',
      title: 'A semantic web primer',
      recordType: 'INSTANCE',
      affectedRecords: [],
    };
    const { recordInfo } = getHookExecutionResult(useGenerateAffectedRecordInfo, [{ logs }], translationsProperties);

    expect(recordInfo).to.eql([
      '{',
      '"Instance UUID": "5bf370e0-8cca-4d9c-82e4-5170ab2a0a39"',
      '"Instance HRID": "inst000000000022"',
      '"Instance Title": "A semantic web primer"',
      '}',
    ]);
  });

  it('should return correct record info with 1 level nesting', () => {
    const logs = {
      id: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
      hrid: 'inst000000000022',
      title: 'A semantic web primer',
      recordType: 'INSTANCE',
      affectedRecords: [{
        id: 'e3ff6133-b9a2-4d4c-a1c9-dc1867d4df19',
        hrid: 'hold000000000009',
        recordType: 'HOLDINGS',
        affectedRecords: [],
      }],
    };
    const { recordInfo } = getHookExecutionResult(useGenerateAffectedRecordInfo, [{ logs }], translationsProperties);

    expect(recordInfo).to.eql([
      '{',
      '"Instance UUID": "5bf370e0-8cca-4d9c-82e4-5170ab2a0a39"',
      '"Instance HRID": "inst000000000022"',
      '"Instance Title": "A semantic web primer"',
      '"Associated Holdings UUID": "e3ff6133-b9a2-4d4c-a1c9-dc1867d4df19"',
      '"Associated Holdings HRID": "hold000000000009"',
      '}',
    ]);
  });

  it('should return correct record info with 2 level nesting', () => {
    const { recordInfo } = getHookExecutionResult(useGenerateAffectedRecordInfo, [{ logs: errorLogs[2].affectedRecord }], translationsProperties);

    expect(recordInfo).to.eql([
      '{',
      '"Instance UUID": "5bf370e0-8cca-4d9c-82e4-5170ab2a0a39"',
      '"Instance HRID": "inst000000000022"',
      '"Instance Title": "A semantic web primer"',
      '"Associated Holdings UUID": "e3ff6133-b9a2-4d4c-a1c9-dc1867d4df19"',
      '"Associated Holdings HRID": "hold000000000009"',
      '"Associated Item UUID": "100d10bf-2f06-4aa0-be15-0b95b2d9f9e3"',
      '"Associated Item HRID": "item000000000015"',
      '"Associated Item UUID": "7212ba6a-8dcf-45a1-be9a-ffaa847c4423"',
      '"Associated Item HRID": "item000000000014"',
      '}',
    ]);
  });
});
