import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import '../test/jest/__mock__';
import '../test/jest/__new_mock__';
import { screen, render } from '@testing-library/react';
import DataExport from './index';

jest.mock('./settings', () => ({
  DataExportSettings: () => <div>DataExportSettings</div>
}));

jest.mock('./routes/Home', () => () => <div>Home</div>);

const setupDataExport = ({
  showSettings,
  match = { path: '/' },
} = {}) => render(
  <BrowserRouter>
    <DataExport
      showSettings={showSettings}
      match={match}
    />
  </BrowserRouter>
);

describe('DataExport', () => {
  it('should display Data export settings', () => {
    setupDataExport({ showSettings: true });

    expect(screen.getByText('DataExportSettings')).toBeVisible();
  });

  it('should display Data export settings', () => {
    setupDataExport();

    expect(screen.getByText('Home')).toBeVisible();
  });

});
