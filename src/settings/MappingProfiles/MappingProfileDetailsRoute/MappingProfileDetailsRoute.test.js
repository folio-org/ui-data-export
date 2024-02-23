import React from 'react';

import '../../../../test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { screen } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import { MappingProfileDetailsRoute } from '.';

import { translationsProperties } from '../../../../test/helpers';

jest.mock('../MappingProfileDetails', () => ({
  MappingProfileDetails: () => (<div>MappingProfileDetails</div>)
}));

const setupMappingProfileDetailsRoute = ({
  resources = {
    mappingProfile: {},
    jobProfiles: [],
  },
  allTransformations = [],
  mutator = { mappingProfile: { DELETE: jest.fn() } },
  history = {},
  match = { params: {} },
  location = {},
  onCancel = jest.fn(),
} = {}) => {
  renderWithIntl(
    <MappingProfileDetailsRoute
      resources={resources}
      allTransformations={allTransformations}
      mutator={mutator}
      history={history}
      match={match}
      location={location}
      onCancel={onCancel}
    />,
    translationsProperties
  );
};

describe('MappingProfileDetailsRoute', () => {
  it('should display mapping profile details route', async () => {
    setupMappingProfileDetailsRoute();

    expect(screen.getByText('MappingProfileDetails')).toBeVisible();
  });


  it('should render with no axe errors', async () => {
    setupMappingProfileDetailsRoute();

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
