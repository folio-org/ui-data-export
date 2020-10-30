import React from 'react';
import { useIntl } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';

import { Paneset } from '@folio/stripes/components';
import { CalloutContext } from '@folio/stripes/core';
import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/testUtils';

import { DuplicateMappingProfileRouteComponent } from './DuplicateMappingProfileRoute';
import {
  OverlayContainer,
  translationsProperties,
} from '../../../../test/helpers';
import {
  mappingProfileWithTransformations as mappingProfile,
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { renderWithIntl } from '../../../../test/jest/helpers';

function DuplicateMappingProfileRouteContainer({
  allTransformations = [],
  profile = mappingProfile,
  mutator = {},
  sendCallout = noop,
  onSubmit = noop,
  onCancel = noop,
  onSubmitNavigate = noop,
} = {}) {
  const intl = useIntl();

  return (
    <Router>
      <OverlayContainer />
      <Paneset>
        <CalloutContext.Provider value={{ sendCallout }}>
          <DuplicateMappingProfileRouteComponent
            allTransformations={generateTransformationsWithDisplayName(intl, allTransformations)}
            resources={buildResources({
              resourceName: 'mappingProfile',
              records: [profile],
            })}
            mutator={buildMutator({ mappingProfile: mutator })}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onSubmitNavigate={onSubmitNavigate}
          />
        </CalloutContext.Provider>
      </Paneset>
    </Router>
  );
}

describe('DuplicateMappingProfileRoute', () => {
  describe('rendering duplicate mapping profile page with profile data: success scenario', () => {
    beforeEach(() => {
      renderWithIntl(
        <DuplicateMappingProfileRouteContainer allTransformations={allMappingProfilesTransformations} />,
        translationsProperties,
      );
    });

    it('should have correct name field value', () => {
      expect(screen.getByLabelText(/Name/)).toHaveValue(`Copy of ${mappingProfile.name}`);
    });

    it('should have enabled save button if there are no changes', () => {
      screen.debug(screen.getByRole('button', { name: 'Save & close' }));
      expect(screen.getByRole('button', { name: 'Save & close' })).toBeEnabled();
    });
  });
});
