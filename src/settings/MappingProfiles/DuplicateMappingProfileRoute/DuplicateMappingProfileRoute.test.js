import React from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/testUtils';

import { DuplicateMappingProfileRouteComponent } from './DuplicateMappingProfileRoute';
import { translationsProperties } from '../../../../test/helpers';
import {
  mappingProfileWithTransformations as mappingProfile,
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { renderWithIntl } from '../../../../test/jest/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers/SettingsComponentBuilder';

const instanceTransformation = {
  fieldId: 'instance.title',
  displayNameKey: 'instance.title',
  path: '$.instance[*].title',
  recordType: 'INSTANCE',
};

function DuplicateMappingProfileRouteContainer({
  allTransformations = [],
  profile = {
    ...mappingProfile,
    recordTypes: ['INSTANCE'],
    transformations: [instanceTransformation],
  },
  mutator = {},
  onSubmit = noop,
  onCancel = noop,
  onSubmitNavigate = noop,
} = {}) {
  const intl = useIntl();

  return (
    <SettingsComponentBuilder>
      <DuplicateMappingProfileRouteComponent
        allTransformations={generateTransformationsWithDisplayName(intl, [...allTransformations, instanceTransformation])}
        resources={buildResources({
          resourceName: 'mappingProfile',
          records: [profile],
        })}
        mutator={buildMutator({ mappingProfile: mutator })}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onSubmitNavigate={onSubmitNavigate}
      />
    </SettingsComponentBuilder>
  );
}

describe('DuplicateMappingProfileRoute', () => {
  describe('rendering duplicate mapping profile page with profile data: success scenario', () => {
    beforeEach(() => {
      renderWithIntl(
        <DuplicateMappingProfileRouteContainer allTransformations={allMappingProfilesTransformations} />,
        translationsProperties
      );
    });

    it('should have correct name field value', () => {
      expect(screen.getByLabelText(/Name/)).toHaveValue(`Copy of ${mappingProfile.name}`);
    });

    it('should have enabled save button if there are no changes', () => {
      screen.debug(screen.getByRole('button', { name: 'Save & close' }));
      expect(screen.getByRole('button', { name: 'Save & close' })).toBeEnabled();
    });

    it('should have disabled SRS record type', () => {
      expect(screen.getByDisplayValue('SRS')).toBeDisabled();
    });
  });
});
