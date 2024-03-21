import React from 'react';
import {
  screen,
  render,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../test/jest/__mock__';
import '../../../test/jest/__new_mock__';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/testUtils';
import { runAxeTest } from '@folio/stripes-testing';

import { AllJobLogsViewComponent } from '.';
import { translationsProperties } from '../../../test/helpers';
import { SettingsComponentBuilder } from '../../../test/jest/helpers';
import {
  logJobExecutions,
  relatedUsers,
  jobProfilesList,
} from '../../../test/bigtest/network/scenarios/fetch-job-executions-success';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const mockData = {
  'jobProfilesList': {
    records: jobProfilesList,
    hasLoaded: true,
    isPending: false,
    other: { totalRecords: jobProfilesList.length },
  },
  'usersList': {
    records: relatedUsers,
    hasLoaded: true,
    isPending: false,
    other: { totalRecords: relatedUsers.length },
  },
};
const renderAllJobLogsViewContainer = () => {
  render(
    <SettingsComponentBuilder>
      <AllJobLogsViewComponent
        resources={buildResources({
          resourceName: 'jobExecutions',
          records: logJobExecutions,
          otherResources: mockData
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

    expect(screen.getByText('ui-data-export.logsPaneTitle'));
    expect(screen.getByText('ui-data-export.searchResultsCountHeader')).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    renderAllJobLogsViewContainer();

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should be sorted by "completedDate" descending', () => {
    renderAllJobLogsViewContainer();

    const searchResults = document.querySelectorAll('[aria-sort=descending]');

    searchResults.forEach(el => expect(el).toBeVisible());
  });

  it('should render list columns', () => {
    renderAllJobLogsViewContainer();

    expect(screen.getByText('stripes-data-transfer-components.jobExecutionHrId')).toBeVisible();
    expect(screen.getByText('ui-data-export.total')).toBeVisible();
    expect(screen.getByText('stripes-data-transfer-components.runBy')).toBeVisible();
    expect(screen.getByText('ui-data-export.failed')).toBeVisible();
  });

  describe('clicking on status column header', () => {
    it('should have the correct query in path', () => {
      renderAllJobLogsViewContainer();

      userEvent.click(screen.getByRole('button', { name: /status/i }));

      expect(decodeURIComponent(window.location.search)).toContain('?sort=status');
    });
  });

  describe('clicking on file name with error flow', () => {
    it('should show error notification', async () => {
      renderAllJobLogsViewContainer();

      userEvent.click(screen.getByRole('gridcell', { name: 'import-1.mrc' }));

      expect(screen.getByRole('gridcell', { name: 'ui-data-export.jobStatus.fail' })).toBeVisible();
    });
  });
});
