import React from 'react';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { screen } from '@testing-library/react';
import { buildMutator, buildResources } from '@folio/stripes-data-transfer-components/testUtils';
import { noop } from 'lodash';
import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { JobProfilesContainer } from './index';

const setupJobProfilesContainer = () => {
  renderWithIntl(
    <SettingsComponentBuilder>
      <JobProfilesContainer
        resources={buildResources({
          resourceName: 'jobProfiles',
          records: [],
        })}
        mutator={buildMutator({ jobProfile: { PUT: noop } })}
        match={{ params: { }, path: '/data-export/job-profiles', url: '/' }}
      />
    </SettingsComponentBuilder>,
    translationsProperties
  );
};

describe('JobProfilesContainer', () => {
  it('should render correct', async () => {
    setupJobProfilesContainer();

    const search = await screen.findByText(/stripes-smart-components.search/i);

    expect(search).toBeVisible();
  });
});
