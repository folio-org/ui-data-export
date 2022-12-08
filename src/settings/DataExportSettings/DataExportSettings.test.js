import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';
import '../../../test/jest/__new_mock__';
import { render, screen } from '@testing-library/react';
import  { DataExportSettings } from './DataExportSettings';

jest.mock('@folio/stripes-smart-components/lib/Settings', () => () => <div>Settings</div>);

const setupDataExportSettings = () => render(
  <BrowserRouter>
    <DataExportSettings />
  </BrowserRouter>
);

describe('RecentJobLogs', () => {
  it('should display Settings', () => {
    setupDataExportSettings();

    expect(screen.getByText('Settings')).toBeVisible();
  });

});
