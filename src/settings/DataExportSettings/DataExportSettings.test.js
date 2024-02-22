import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';
import '../../../test/jest/__new_mock__';
import { render, screen } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import { DataExportSettings } from './DataExportSettings';

jest.mock('@folio/stripes-smart-components/lib/Settings', () => () => <div>Settings</div>);

const setupDataExportSettings = (locationMock) => render(
  <BrowserRouter>
    <DataExportSettings location={locationMock} />
  </BrowserRouter>
);

describe('RecentJobLogs', () => {
  it('should display Settings', () => {
    const locationMock = {
      pathname: 'pathname',
      search: '',
      hash: '',
    };
    setupDataExportSettings(locationMock);

    expect(screen.getByText('Settings')).toBeVisible();
  });

  it('should display Settings on job profile', () => {
    const locationMock = {
      pathname: 'pathname/job-profiles',
      search: '',
      hash: '',
    };
    setupDataExportSettings(locationMock);

    expect(screen.getByText('Settings')).toBeVisible();
  });

  it('should display Settings on mapping profile', () => {
    const locationMock = {
      pathname: 'pathname/mapping-profiles',
      search: '',
      hash: '',
    };
    setupDataExportSettings(locationMock);

    expect(screen.getByText('Settings')).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    const locationMock = {
      pathname: 'pathname/mapping-profiles',
      search: '',
      hash: '',
    };
    setupDataExportSettings(locationMock);

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
