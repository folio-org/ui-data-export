import React from 'react';
import { getByText } from '@testing-library/react';

import '../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { ErrorLogsView } from './ErrorLogsView';
import { translationsProperties } from '../../../test/helpers';
import { errorLogs } from '../../../test/bigtest/fixtures/errorLogs';

describe('ErrorLogsView', () => {
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
    });

    it('should render correct error info', () => {
      const errorLogContainers = document.querySelectorAll('[data-test-error-log]');

      expect(getByText(errorLogContainers[0], `${errorLogs[0].createdDate} ${errorLogs[0].logLevel} An error occurred during fields mapping for srs record with id: ${errorLogs[0].errorMessageValues[0]}, reason: ${errorLogs[0].errorMessageValues[1]}, cause: ${errorLogs[0].errorMessageValues[2]}`)).toBeInTheDocument();
      expect(getByText(errorLogContainers[1], `${errorLogs[1].createdDate} ${errorLogs[1].logLevel} UUIDs not found in SRS or inventory: ${errorLogs[1].errorMessageValues[0]}`)).toBeInTheDocument();
      expect(getByText(errorLogContainers[2], `${errorLogs[2].createdDate} ${errorLogs[2].logLevel} Error while getting holdings by instance id: ${errorLogs[2].errorMessageValues[0]}, message: ${errorLogs[2].errorMessageValues[1]}`)).toBeInTheDocument();
    });
  });
});
