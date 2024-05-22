import React from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import { AllJobLogsViewComponent } from '.';
import { SettingsComponentBuilder } from '../../../test/jest/helpers';
import {
  logJobExecutions,
  relatedUsers,
  jobProfilesList,
} from '../../../test/bigtest/network/scenarios/fetch-job-executions-success';
import useJobExecutions from '../../hooks/useJobExecutions';
import useUsers from '../../hooks/useUsers';
import useJobProfiles from '../../hooks/useJobProfiles';
import { translationsProperties } from '../../../test/helpers';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  TitleManager: ({ children }) => <>{children}</>,
}), { virtual: true });

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

jest.mock('../../hooks/useJobExecutions', () => ({
  useJobExecutions: jest.fn(),
}));

jest.mock('../../hooks/useUsers', () => ({
  useUsers: jest.fn(),
}));

jest.mock('../../hooks/useJobProfiles', () => ({
  useJobProfiles: jest.fn(),
}));

useJobExecutions.mockReturnValue({
  jobExecutions: logJobExecutions,
  totalRecords: logJobExecutions.length,
  isFetching: false,
});

useUsers.mockReturnValue({
  users: relatedUsers,
  isLoading: false,
});

useJobProfiles.mockReturnValue({
  jobProfiles: jobProfilesList.jobProfiles,
  isLoading: false,
});

const renderAllJobLogsViewContainer = () => {
  return renderWithIntl(
    <SettingsComponentBuilder>
      <AllJobLogsViewComponent />
    </SettingsComponentBuilder>,
    translationsProperties
  );
};

describe('AllJobLogsView', () => {
  it('should display logs list', () => {
    const { debug, getByText } = renderAllJobLogsViewContainer();

    debug(undefined, Infinity);

    expect(getByText('Logs'));
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

  it('should render list columns', async () => {
    const { getByRole } = renderAllJobLogsViewContainer();

    const grid = getByRole('grid');

    expect(within(grid).getByText('File name')).toBeVisible();
    expect(within(grid).getByText('Status')).toBeVisible();
    expect(within(grid).getByText('Total')).toBeVisible();
    expect(within(grid).getByText('Exported')).toBeVisible();
    expect(within(grid).getByText('Failed')).toBeVisible();
    expect(within(grid).getByText('Job profile')).toBeVisible();
    expect(within(grid).getByText('Started running')).toBeVisible();
    expect(within(grid).getByText('Ended running')).toBeVisible();
    expect(within(grid).getByText('Run by')).toBeVisible();
    expect(within(grid).getByText('ID')).toBeVisible();
  });

  describe('clicking on status column header', () => {
    it('should have the correct query in path', () => {
      renderAllJobLogsViewContainer();

      userEvent.click(screen.getByRole('button', { name: /status/i }));

      expect(decodeURIComponent(window.location.search)).toContain('?limit=100&offset=0&sort=status');
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
