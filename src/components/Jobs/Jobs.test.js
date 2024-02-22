import React from 'react';

import '../../../test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { screen } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import { Jobs } from '.';

import { translationsProperties } from '../../../test/helpers';

const setupJobs = () => {
  renderWithIntl(
    <Jobs />,
    translationsProperties
  );
};

describe('Jobs', () => {
  it('should display Jobs accordion', () => {
    setupJobs();

    expect(screen.getByRole('button', { name: 'ui-data-export.runningJobs' })).toBeVisible();
  });

  it('should render with no axe errors', async () => {
    setupJobs();

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
