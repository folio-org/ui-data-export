import { IntlProvider, useIntl } from 'react-intl';

import '../../../../test/jest/__mock__';

import { renderHook } from '@testing-library/react-hooks';
import { generateAffectedRecordInfo } from './generateAffectedRecordInfo';
import { errorLogs } from '../../../../test/bigtest/fixtures/errorLogs';

const useGenerateAffectedRecordInfo = ({ logs }) => {
  const intl = useIntl();

  return { recordInfo: generateAffectedRecordInfo(logs, intl.formatMessage) };
};

const messages = {
  'ui-data-export.errorLogs.record.Title': '"{recordType} Title": "{value}"',
  'ui-data-export.errorLogs.record.UUID': '"{recordType} UUID": "{value}"',
  'ui-data-export.errorLogs.record.HRID': '"{recordType} HRID": "{value}"',
  'ui-data-export.errorLogs.recordAssociated.HRID': '"Associated {recordType} HRID": "{value}"',
  'ui-data-export.errorLogs.recordAssociated.UUID': '"Associated {recordType} UUID": "{value}"',
  'ui-data-export.errorLogs.inventoryRecordLink': '"Inventory record link": ',
  'ui-data-export.errorLogs.recordAssociated.Title': '"Associated {recordType} Title": "{value}"',
};

const wrapper = ({ children }) => (
  <IntlProvider locale="en" messages={messages}>
    {children}
  </IntlProvider>
);

describe('generateAffectedRecordInfo', () => {
  it('should return correct instance record info without affected records (affectedRecords field is provided but empty)', () => {
    const logs = {
      id: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
      hrid: 'inst000000000022',
      title: 'A semantic web primer',
      recordType: 'INSTANCE',
      affectedRecords: [],
    };
    const { result } = renderHook(() => useGenerateAffectedRecordInfo({ logs }), { wrapper });

    expect(result.current.recordInfo).toEqual([
      '{',
      '"Instance UUID": "5bf370e0-8cca-4d9c-82e4-5170ab2a0a39"',
      '"Instance HRID": "inst000000000022"',
      '"Instance Title": "A semantic web primer"',
      '}',
    ]);
  });

  it('should return correct item record info without affected records (affectedRecords field is not provided)', () => {
    const logs = {
      id: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
      hrid: 'inst000000000022',
      title: 'A semantic web primer',
      recordType: 'ITEM',
    };
    const { result } = renderHook(() => useGenerateAffectedRecordInfo({ logs }), { wrapper });

    expect(result.current.recordInfo).toEqual([
      '{',
      '"Item UUID": "5bf370e0-8cca-4d9c-82e4-5170ab2a0a39"',
      '"Item HRID": "inst000000000022"',
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
    const { result } = renderHook(() => useGenerateAffectedRecordInfo({ logs }), { wrapper });

    expect(result.current.recordInfo).toEqual([
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
    const { result } = renderHook(() => useGenerateAffectedRecordInfo({ logs: errorLogs[2].affectedRecord }), { wrapper });

    expect(result.current.recordInfo[0]).toEqual('{');
    expect(result.current.recordInfo[1]).toEqual('"Instance UUID": "5bf370e0-8cca-4d9c-82e4-5170ab2a0a39"');
    expect(result.current.recordInfo[2]).toEqual('"Instance HRID": "inst000000000022"');
    expect(result.current.recordInfo[3]).toEqual('"Instance Title": "A semantic web primer"');
    expect(result.current.recordInfo[4].props.children[0]).toEqual('"Inventory record link": ');
    expect(result.current.recordInfo[4].props.children[1].props).toEqual(expect.objectContaining({
      href: 'https://folio-snapshot-load.dev.folio.org/inventory/view/e54b1f4d-7d05-4b1a-9368-3c36b75d8ac6',
      target: '_blank',
      children: 'https://folio-snapshot-load.dev.folio.org/inventory/view/e54b1f4d-7d05-4b1a-9368-3c36b75d8ac6',
    }));
    expect(result.current.recordInfo[5]).toEqual('"Associated Holdings UUID": "e3ff6133-b9a2-4d4c-a1c9-dc1867d4df19"');
    expect(result.current.recordInfo[6]).toEqual('"Associated Holdings HRID": "hold000000000009"');
    expect(result.current.recordInfo[7]).toEqual('"Associated Item UUID": "100d10bf-2f06-4aa0-be15-0b95b2d9f9e3"');
    expect(result.current.recordInfo[8]).toEqual('"Associated Item HRID": "item000000000015"');
    expect(result.current.recordInfo[9]).toEqual('"Associated Item UUID": "7212ba6a-8dcf-45a1-be9a-ffaa847c4423"');
    expect(result.current.recordInfo[10]).toEqual('"Associated Item HRID": "item000000000014"');
    expect(result.current.recordInfo[11]).toEqual('}');
  });

  it('should provide title only for instance', () => {
    const logs = {
      id: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
      hrid: 'inst000000000022',
      recordType: 'HOLDINGS',
      affectedRecords: [{
        id: 'e3ff6133-b9a2-4d4c-a1c9-dc1867d4df19',
        hrid: 'hold000000000009',
        title: 'A semantic web primer',
        recordType: 'INSTANCE',
        affectedRecords: [],
      }],
    };
    const { result } = renderHook(() => useGenerateAffectedRecordInfo({ logs }), { wrapper });

    expect(result.current.recordInfo).toEqual([
      '{',
      '"Holdings UUID": "5bf370e0-8cca-4d9c-82e4-5170ab2a0a39"',
      '"Holdings HRID": "inst000000000022"',
      '"Associated Instance UUID": "e3ff6133-b9a2-4d4c-a1c9-dc1867d4df19"',
      '"Associated Instance HRID": "hold000000000009"',
      '"Associated Instance Title": "A semantic web primer"',
      '}',
    ]);
  });
});
