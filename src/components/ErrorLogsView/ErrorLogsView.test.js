import React from 'react';
import {
  getByTestId,
  getByText,
  queryByTestId,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { ErrorLogsView } from './ErrorLogsView';
import { translationsProperties } from '../../../test/helpers';
import { errorLogs } from '../../../test/bigtest/fixtures/errorLogs';

describe('ErrorLogsView', () => {
  let errorLogContainers;

  describe('rendering ErrorLogsView', () => {
    beforeEach(() => {
      renderWithIntl(
        <ErrorLogsView resources={{
          log: {
            records: errorLogs,
            hasLoaded: true,
          },
        }}
        />,
        translationsProperties
      );

      errorLogContainers = document.querySelectorAll('[data-test-error-log]');
    });

    it('should render correct error info', () => {
      expect(getByText(errorLogContainers[0], `${errorLogs[0].createdDate} ${errorLogs[0].logLevel} An error occurred during fields mapping for srs record with id: ${errorLogs[0].errorMessageValues[0]}, reason: ${errorLogs[0].errorMessageValues[1]}, cause: ${errorLogs[0].errorMessageValues[2]}`)).toBeInTheDocument();
      expect(getByText(errorLogContainers[1], `${errorLogs[1].createdDate} ${errorLogs[1].logLevel} UUIDs not found in SRS or inventory: ${errorLogs[1].errorMessageValues[0]}`)).toBeInTheDocument();
      expect(getByText(errorLogContainers[2], `${errorLogs[2].createdDate} ${errorLogs[2].logLevel} Error while getting holdings by instance id: ${errorLogs[2].errorMessageValues[0]}, message: ${errorLogs[2].errorMessageValues[1]}`)).toBeInTheDocument();
    });

    it('should display record link', () => {
      const link = getByTestId(errorLogContainers[2], 'record-link');

      expect(link).toBeInTheDocument();
      expect(link.href).toEqual(errorLogs[2].affectedRecord.inventoryRecordLink);
      expect(getByText(link, errorLogs[2].affectedRecord.inventoryRecordLink)).toBeInTheDocument();
    });

    it('should not display a link, if its not present in affected record', () => {
      expect(queryByTestId(errorLogContainers[0], 'record-link')).not.toBeInTheDocument();
    });
  });
});
