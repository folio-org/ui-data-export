import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import '../../../test/jest/__mock__';
import '../../../test/jest/__new_mock__';
import { render, screen } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import { DataFetcherContext } from '../../contexts/DataFetcherContext';
import { RecentJobLogs } from '.';

jest.mock('@folio/stripes-data-transfer-components', () => ({
  ...jest.requireActual('@folio/stripes-data-transfer-components'),
  JobLogs: () => <div>JobLogs</div>,
}), { virtual: true });

const setupRecentJobLogs = () => render(
  <DataFetcherContext.Provider
    value={{
      logs: [],
      hasLoaded: true,
    }}
  >
    <BrowserRouter>
      <RecentJobLogs
        resources={{}}
        mutator={{}}
      />
    </BrowserRouter>
  </DataFetcherContext.Provider>
);

describe('RecentJobLogs', () => {
  it('should display Job logs', () => {
    setupRecentJobLogs();

    expect(screen.getByText('JobLogs')).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    setupRecentJobLogs();

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
