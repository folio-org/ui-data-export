import React from 'react';

import '../../../test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { screen } from '@testing-library/react';
import { Jobs } from '.';

import { translationsProperties } from '../../../test/helpers';

const setupJobs = () => {
  renderWithIntl(
    <Jobs />,
    translationsProperties
  )
};

describe('Jobs', () => {
  it('should display Jobs accordion', () => {
    setupJobs();

    expect(screen.getByRole('button', { name: 'Running' })).toBeVisible();
  });

});