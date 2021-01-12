import React from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import {
  screen,
  getAllByRole,
  getByText,
  getByRole,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/testUtils';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { DuplicateMappingProfileRouteComponent } from './DuplicateMappingProfileRoute';
import { translationsProperties } from '../../../../test/helpers';
import {
  mappingProfileWithTransformations as mappingProfile,
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import {
  SettingsComponentBuilder,
  getTransformationFieldGroups,
} from '../../../../test/jest/helpers';

const instanceTransformation = {
  fieldId: 'instance.title',
  transformation: '900 1$12',
  displayNameKey: 'instance.title',
  path: '$.instance[*].title',
  recordType: 'INSTANCE',
};

const DuplicateMappingProfileRouteContainer = ({
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
} = {}) => {
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
};

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
      expect(screen.getByRole('button', { name: 'Save & close' })).toBeEnabled();
    });

    it('should have disabled SRS record type', () => {
      expect(screen.getByDisplayValue('SRS')).toBeDisabled();
    });

    it('should display transformation value', () => {
      const transformationListRows = getAllByRole(screen.getByRole('rowgroup'), 'row');

      expect(getByText(transformationListRows[0], '900 1$12')).toBeVisible();
    });

    it('should fill transformation field group on transformation modal correctly', () => {
      userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));
      const transformationFields = getTransformationFieldGroups();

      expect(transformationFields[2].marcField.input.value).toBe('900');
      expect(transformationFields[2].indicator1.input.value).toBe('');
      expect(transformationFields[2].indicator2.input.value).toBe('1');
      expect(transformationFields[2].subfield.input.value).toBe('$12');
    });

    it('should not show validation error when clearing transformation with empty indicator field', () => {
      userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));
      const transformationFields = getTransformationFieldGroups();
      const modal = document.querySelector('[data-test-transformations-modal]');

      userEvent.type(transformationFields[2].marcField.input, '');
      userEvent.type(transformationFields[0].indicator2.input, '');
      userEvent.type(transformationFields[0].subfield.input, '');

      userEvent.click(screen.getByLabelText('Select all fields'));
      userEvent.click(screen.getByLabelText('Select all fields'));

      userEvent.click(getByRole(modal, 'button', { name: 'Save & close' }));

      return waitForElementToBeRemoved(() => document.querySelector('[data-test-transformations-modal]'));
    });
  });
});
