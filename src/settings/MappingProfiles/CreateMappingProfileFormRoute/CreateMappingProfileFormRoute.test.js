import React from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import {
  screen,
  waitFor,
  getByText,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

import { CreateMappingProfileFormRoute } from './CreateMappingProfileFormRoute';
import { translationsProperties } from '../../../../test/helpers';
import {
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { renderWithIntl } from '../../../../test/jest/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers/SettingsComponentBuilder';

function CreateMappingProfileFormRouteContainer({
  allTransformations = [],
  initialValues = {
    transformations: [],
    records: [],
    recordTypes: [],
    outputFormat: 'MARC',
  },
  isFormDirty = true,
  onSubmit = noop,
  onCancel = noop,
  onSubmitNavigate = noop,
} = {}) {
  const intl = useIntl();

  return (
    <SettingsComponentBuilder>
      <CreateMappingProfileFormRoute
        allTransformations={generateTransformationsWithDisplayName(intl, allTransformations)}
        initialValues={initialValues}
        isFormDirty={isFormDirty}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onSubmitNavigate={onSubmitNavigate}
      />
    </SettingsComponentBuilder>
  );
}

describe('CreateMappingProfileFormRoute', () => {
  describe('creating new mapping profile', () => {
    const onSubmitNavigate = jest.fn();
    const onSubmit = jest.fn();

    beforeEach(() => {
      renderWithIntl(
        <CreateMappingProfileFormRouteContainer
          allTransformations={allMappingProfilesTransformations}
          onSubmitNavigate={onSubmitNavigate}
          onSubmit={onSubmit}
        />,
        translationsProperties,
      );
    });

    it('should initiate creating of mapping profile with correct values', async () => {
      const name = 'New mapping profile';

      await userEvent.type(screen.getByLabelText('Name*'), name);
      userEvent.click(screen.getByRole('checkbox', { name: 'Holdings' }));
      userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

      expect(onSubmit).toHaveBeenCalledWith({
        name,
        outputFormat: 'MARC',
        recordTypes: ['HOLDINGS'],
        records: [],
        transformations: [],
      });

      await waitFor(() => expect(onSubmitNavigate).toHaveBeenCalled());
    });

    it('should display validation error when name field is empty', () => {
      onSubmit.mockRestore();
      userEvent.click(screen.getByRole('checkbox', { name: 'Holdings' }));
      userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

      expect(getByText(document.querySelector('[data-test-mapping-profile-form-name]'), 'Please enter a value')).toBeVisible();
      expect(screen.getByLabelText('Name*')).not.toBeValid();
      expect(onSubmit).not.toBeCalled();
    });
  });
});
