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
      const errorLogContainer = document.querySelector('[data-test-error-log]');
      const {
        createdDate,
        logLevel,
        errorMessageValues,
      } = errorLogs[0];

      expect(getByText(errorLogContainer, `${createdDate} ${logLevel} An error occurred during fields mapping for srs record with id: ${errorMessageValues[0]}, reason: ${errorMessageValues[1]}, cause: ${errorMessageValues[2]}`)).toBeInTheDocument();
    });
  });
});
