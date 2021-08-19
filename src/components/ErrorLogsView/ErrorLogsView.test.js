import React from 'react';
import { screen } from '@testing-library/react';

import '../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { ErrorLogsView } from './ErrorLogsView';
import { translationsProperties } from '../../../test/helpers';
import { errorLogs } from '../../../test/bigtest/fixtures/errorLogs';

const logs = [
  log => `${log.createdDate} ${log.logLevel} An error occurred during fields mapping for srs record with id: ${log.errorMessageValues[0]}, reason: ${log.errorMessageValues[1]}, cause: ${log.errorMessageValues[2]}`,
  log => `${log.createdDate} ${log.logLevel} UUIDs not found in SRS or inventory: ${log.errorMessageValues[0]}`,
  log => `${log.createdDate} ${log.logLevel} Error while getting holdings by instance id: ${log.errorMessageValues[0]}, message: ${log.errorMessageValues[1]}`,
];

const renderErrorLogView = ({ records, hasLoaded } = {}) => {
  return renderWithIntl(
    <ErrorLogsView resources={{
      log: {
        records,
        hasLoaded,
      },
    }}
    />,
    translationsProperties
  );
};

describe('ErrorLogsView', () => {
  describe('rendering ErrorLogsView', () => {
    it('should render correct error info', async () => {
      renderErrorLogView({ hasLoaded: true, records: errorLogs });

      for (const [index, log] of errorLogs.entries()) {
        expect(await screen.findByText(logs[index](log))).toBeInTheDocument();
      }
    });

    it('should not render correct info if hasn`t loaded', async () => {
      renderErrorLogView({ hasLoaded: false, records: errorLogs });

      for (const [index, log] of errorLogs.entries()) {
        expect(screen.queryByText(logs[index](log))).not.toBeInTheDocument();
      }
    });

    it('should display record link', async () => {
      renderErrorLogView({ hasLoaded: true, records: errorLogs });

      const link = await screen.findByText(errorLogs[2].affectedRecord.inventoryRecordLink);

      expect(link).toBeInTheDocument();
    });

    it('should not display a link, if its not present in affected record', async () => {
      renderErrorLogView({ hasLoaded: true, records: [errorLogs[1]] });

      const link = screen.queryByText(errorLogs[2].affectedRecord.inventoryRecordLink);

      expect(link).not.toBeInTheDocument();
    });
  });
});
