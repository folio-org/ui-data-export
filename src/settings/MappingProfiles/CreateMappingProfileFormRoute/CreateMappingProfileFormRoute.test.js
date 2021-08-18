import React from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import {
  screen,
  waitFor,
  getByText,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { CreateMappingProfileFormRoute } from './CreateMappingProfileFormRoute';
import { translationsProperties } from '../../../../test/helpers';
import {
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';

function CreateMappingProfileFormRouteContainer({
  allTransformations = [],
  initialValues = {
    transformations: [],
    records: [],
    recordTypes: [],
    outputFormat: 'MARC',
  },
  isFormDirty = true,
  sendCallout = noop,
  onSubmit = noop,
  onCancel = noop,
  onSubmitNavigate = noop,
} = {}) {
  const intl = useIntl();

  return (
    <SettingsComponentBuilder sendCallout={sendCallout}>
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
    const onSubmitNavigateMock = jest.fn();
    const onSubmitMock = jest.fn();
    const sendCalloutMock = jest.fn();

    beforeEach(() => {
      renderWithIntl(
        <CreateMappingProfileFormRouteContainer
          allTransformations={allMappingProfilesTransformations}
          sendCallout={sendCalloutMock}
          onSubmitNavigate={onSubmitNavigateMock}
          onSubmit={onSubmitMock}
        />,
        translationsProperties
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should initiate creating of mapping profile with correct values', async () => {
      const name = 'New mapping profile';
      const submitFormButton = screen.getByRole('button', { name: 'Save & close' });

      userEvent.type(screen.getByLabelText('Name*'), name);
      userEvent.click(screen.getByRole('checkbox', { name: 'Holdings' }));
      userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));

      const modal = screen.getByRole('document');
      const saveTransrormationsButton = within(modal).getByRole('button', { name: 'Save & close' });
      const tableRow = screen.getByRole('row', { name: 'Select field Holdings - Call number - Call number' });
      const checkbox = within(tableRow).getByRole('checkbox');
      const textFields = within(tableRow).getAllByRole('textbox');

      userEvent.click(checkbox);
      userEvent.type(textFields[0], '500');
      userEvent.type(textFields[3], '$a');
      userEvent.click(saveTransrormationsButton);

      userEvent.click(submitFormButton);

      await waitFor(() => {
        expect(sendCalloutMock.mock.calls[0][0]).not.toHaveProperty('type');
        expect(sendCalloutMock.mock.calls[0][0].message.props.id).toBe('ui-data-export.mappingProfiles.create.successCallout');
        expect(onSubmitNavigateMock).toHaveBeenCalled();
      });
    });

    it('should display validation error when name field is empty', () => {
      userEvent.click(screen.getByRole('checkbox', { name: 'Holdings' }));
      userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

      expect(getByText(document.querySelector('[data-test-mapping-profile-form-name]'), 'Please enter a value')).toBeVisible();
      expect(screen.getByLabelText('Name*')).not.toBeValid();
      expect(onSubmitMock).not.toBeCalled();
    });

    it('should initiate displaying of error callout', async () => {
      onSubmitMock.mockImplementationOnce(() => Promise.reject());

      const submitFormButton = screen.getByRole('button', { name: 'Save & close' });

      userEvent.type(screen.getByLabelText('Name*'), 'Name');
      userEvent.click(screen.getByRole('checkbox', { name: 'Holdings' }));
      userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));

      const modal = screen.getByRole('document');
      const saveTransrormationsButton = within(modal).getByRole('button', { name: 'Save & close' });
      const tableRow = screen.getByRole('row', { name: 'Select field Holdings - Call number - Call number' });
      const checkbox = within(tableRow).getByRole('checkbox');
      const textFields = within(tableRow).getAllByRole('textbox');

      userEvent.click(checkbox);
      userEvent.type(textFields[0], '500');
      userEvent.type(textFields[3], '$a');
      userEvent.click(saveTransrormationsButton);

      userEvent.click(submitFormButton);

      await waitFor(() => {
        expect(sendCalloutMock).toBeCalledWith(
          expect.objectContaining({ type: 'error' })
        );
        expect(sendCalloutMock.mock.calls[0][0].message.props.id).toBe('ui-data-export.mappingProfiles.create.errorCallout');
      });
    });
  });
});
