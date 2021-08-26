import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/testUtils';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import { AllJobLogsViewComponent } from '.';
import { translationsProperties } from '../../../test/helpers';
import { SettingsComponentBuilder } from '../../../test/jest/helpers';
import translations from '../../../translations/ui-data-export/en';
import { getColumnIndexMapping } from '../../../test/bigtest/helpers/getColumnIndexMapping';
import { logJobExecutions } from '../../../test/bigtest/network/scenarios/fetch-job-executions-success';
import { DEFAULT_JOB_LOG_COLUMNS } from '../../utils';

const columnIndexMapping = getColumnIndexMapping(DEFAULT_JOB_LOG_COLUMNS);

const renderAllJobLogsViewContainer = () => {
  renderWithIntl(
    <SettingsComponentBuilder>
      <AllJobLogsViewComponent
        resources={buildResources({
          resourceName: 'jobExecutions',
          records: logJobExecutions,
        })}
        mutator={buildMutator()}
      />
    </SettingsComponentBuilder>,
    translationsProperties
  );
};

describe('AllJobLogsView', () => {
  it('should display logs list', () => {
    renderAllJobLogsViewContainer();

    expect(screen.getByText('Logs'));
    expect(screen.getByText('3 records found')).toBeVisible();
  });

  it('should be sorted by "completedDate" descending', () => {
    renderAllJobLogsViewContainer();

    const searchResults = document.querySelectorAll('[aria-sort=descending]');

    searchResults.forEach(el => expect(el).toBeVisible());
  });

  it('should render list columns', () => {
    renderAllJobLogsViewContainer();

    expect(screen.getByText(commonTranslations.jobExecutionHrId)).toBeVisible();
    expect(screen.getByText(translations.total)).toBeVisible();
    expect(screen.getByText(commonTranslations.runBy)).toBeVisible();
    expect(screen.getByText(translations.failed)).toBeVisible();
  });

  describe('clicking on status column header', () => {
    it('should have the correct query in path', () => {
      renderAllJobLogsViewContainer();

      userEvent.click(screen.getByText(columnIndexMapping.status));

      window.history.pushState({}, document.title, '/?sort=-completedDate');

      expect(decodeURIComponent(window.location.search).includes('?sort=-completedDate')).toBeTruthy();
    });
  });

  describe('clicking on file name with error flow', () => {
    it('should show error notification', async () => {
      renderAllJobLogsViewContainer();

      userEvent.click(screen.getByRole('gridcell', { name: 'import-1.mrc' }));

      expect(screen.getByRole('gridcell', { name: 'Fail' })).toBeVisible();
    });
  });
});
