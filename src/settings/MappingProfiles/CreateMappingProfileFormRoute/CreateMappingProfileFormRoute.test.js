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

import { runAxeTest } from '@folio/stripes-testing';
import { CreateMappingProfileFormRoute } from './CreateMappingProfileFormRoute';
import { translationsProperties } from '../../../../test/helpers';
import {
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { getTransformationFieldGroups, SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { recordTypesHoldings, saveAndCloseBtn } from '../test/setup';

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
  isDuplicate = false
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
        isDuplicate={isDuplicate}
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
      const submitFormButton = screen.getByRole('button', { name: 'stripes-components.saveAndClose' });

      userEvent.type(screen.getByRole('textbox', { name: 'stripes-data-transfer-components.name' }), name);
      userEvent.click(recordTypesHoldings());
      userEvent.click(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' }));

      const modal = screen.getAllByRole('dialog')[0];
      const saveTransrormationsButton = within(modal).getByRole('button', { name: 'stripes-components.saveAndClose' });
      const tableRow = screen.getByRole('row', { name: 'Holdings - Call number - Call number' });
      const checkbox = within(tableRow).getByRole('checkbox');
      const { marcFields, subfields } = getTransformationFieldGroups();

      userEvent.click(checkbox);
      userEvent.type(marcFields[0].querySelector('input'), '500');
      userEvent.type(subfields[0].querySelector('input'), 'a');
      userEvent.click(saveTransrormationsButton);

      userEvent.click(submitFormButton);

      await waitFor(() => {
        expect(sendCalloutMock.mock.calls[0][0]).not.toHaveProperty('type');
        expect(sendCalloutMock.mock.calls[0][0].message.props.id).toBe('ui-data-export.mappingProfiles.create.successCallout');
        expect(onSubmitNavigateMock).toHaveBeenCalled();
      });
    });

    it('should display validation error when name field is empty', () => {
      userEvent.click(recordTypesHoldings());
      userEvent.click(saveAndCloseBtn());

      expect(getByText(document.querySelector('[data-test-mapping-profile-form-name]'), 'stripes-data-transfer-components.validation.enterValue')).toBeVisible();
      expect(screen.getByRole('textbox', { name: 'stripes-data-transfer-components.name' })).not.toBeValid();
      expect(onSubmitMock).not.toBeCalled();
    });

    it('should render with no axe errors', async () => {
      await runAxeTest({
        rootNode: document.body,
      });
    });

    it('should initiate displaying of error callout', async () => {
      onSubmitMock.mockImplementationOnce(() => Promise.reject());

      const submitFormButton = screen.getByRole('button', { name: 'stripes-components.saveAndClose' });

      userEvent.type(screen.getByRole('textbox', { name: 'stripes-data-transfer-components.name' }), 'Name');
      userEvent.click(screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.holdings' }));
      userEvent.click(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' }));

      const modal = screen.getAllByRole('dialog')[0];
      const saveTransrormationsButton = within(modal).getByRole('button', { name: 'stripes-components.saveAndClose' });
      const tableRow = screen.getByRole('row', { name: 'Holdings - Call number - Call number' });
      const checkbox = within(tableRow).getByRole('checkbox');
      const { marcFields, subfields } = getTransformationFieldGroups();

      userEvent.click(checkbox);
      userEvent.type(marcFields[0].querySelector('input'), '500');
      userEvent.type(subfields[0].querySelector('input'), 'a');
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
