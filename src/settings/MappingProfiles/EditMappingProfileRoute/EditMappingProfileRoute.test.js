import React from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import {
  screen,
  getByText, waitFor,
} from '@testing-library/react';

import '../../../../test/jest/__mock__';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/testUtils';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import userEvent from '@testing-library/user-event';
import { translationsProperties } from '../../../../test/helpers';
import {
  mappingProfileWithTransformations as mappingProfile,
  generateTransformationsWithDisplayName, allMappingProfilesTransformations,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { EditMappingProfileRouteComponent } from './EditMappingProfileRoute';
import {
  recordTypeInstance,
  recordTypesHoldings,
  recordTypesItem,
  recordTypesSRS,
  nameField,
  descriptionField,
  saveAndCloseBtn, transformationsBtn, transformationListRows, paneHeader,
} from '../test/setup';

const instanceTransformation = {
  fieldId: 'instance.title',
  transformation: '900 1$12',
  displayNameKey: 'instance.title',
  path: '$.instance[*].title',
  recordType: 'INSTANCE',
};

const EditMappingProfileRouteContainer = ({
  allTransformations = [],
  profile = {
    ...mappingProfile,
    recordTypes: ['INSTANCE'],
    transformations: [instanceTransformation],
  },
  mutator = { PUT: () => Promise.resolve() },
  onCancel = noop,
  onSubmitNavigate = noop,
  sendCallout = noop,
} = {}) => {
  const intl = useIntl();

  return (
    <SettingsComponentBuilder sendCallout={sendCallout}>
      <EditMappingProfileRouteComponent
        contentLabel="Content label"
        allTransformations={generateTransformationsWithDisplayName(intl, allTransformations)}
        resources={buildResources({
          resourceName: 'mappingProfile',
          records: [profile],
        })}
        mutator={buildMutator({ mappingProfile: mutator })}
        onCancel={onCancel}
        onSubmitNavigate={onSubmitNavigate}
      />
    </SettingsComponentBuilder>
  );
};

describe('rendering edit mapping profile page without profile data', () => {
  it('should display preloader', () => {
    renderWithIntl(
      <EditMappingProfileRouteContainer profile={null} />,
      translationsProperties
    );

    expect(screen.getByTestId('preloader')).toBeVisible();
  });

  describe('rendering edit mapping profile page with profile data: success scenario', () => {
    const handleCancelMock = jest.fn();
    const handleSubmitNavigateMock = jest.fn();
    const sendCalloutMock = jest.fn();

    const renderEditMappingProfileRoute = () => renderWithIntl(
      <EditMappingProfileRouteContainer allTransformations={allMappingProfilesTransformations} />,
      translationsProperties
    );

    const renderEditMappingProfileRouteWithMocks = () => renderWithIntl(
      <EditMappingProfileRouteContainer
        allTransformations={allMappingProfilesTransformations}
        sendCallout={sendCalloutMock}
        onSubmitNavigate={handleSubmitNavigateMock}
        onCancel={handleCancelMock}
      />,
      translationsProperties
    );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should display the form', () => {
      const { container } = renderEditMappingProfileRoute();
      const form = container.querySelector('[data-test-full-screen-form]');

      expect(form).toBeVisible();
    });

    it('should have correct form state', () => {
      renderEditMappingProfileRoute();

      expect(paneHeader('AP Holdings 1')).toBeVisible();
      expect(nameField()).toHaveValue(mappingProfile.name);
      expect(descriptionField()).toHaveValue(mappingProfile.description);
      expect(transformationsBtn('Edit transformations')).toBeVisible();
      expect(saveAndCloseBtn()).toBeDisabled();
      expect(recordTypeInstance()).toBeChecked();
      expect(recordTypesSRS()).not.toBeChecked();
      expect(recordTypesHoldings()).not.toBeChecked();
      expect(recordTypesItem()).not.toBeChecked();
    });

    it('should display in form proper values', async () => {
      renderEditMappingProfileRoute();

      userEvent.clear(nameField());
      userEvent.type(nameField(), 'Changed name');
      userEvent.clear(descriptionField());
      userEvent.type(descriptionField(), 'Changed description');
      userEvent.type(recordTypesHoldings(), 'instance');
      userEvent.click(saveAndCloseBtn());

      expect(nameField()).toHaveValue('Changed name');
      expect(descriptionField()).toHaveValue('Changed description');
      expect(recordTypesHoldings()).toBeChecked();
    });

    describe('clicking on cancel button', () => {
      it('should call cancel callback', () => {
        renderEditMappingProfileRouteWithMocks();

        userEvent.click(screen.getByText(/cancel/i));

        expect(handleCancelMock).toHaveBeenCalled();
      });
    });

    describe('opening transformations modal', () => {
      it('should display transformation value', () => {
        renderEditMappingProfileRoute();

        userEvent.click(transformationsBtn('Edit transformations'));

        expect(getByText(transformationListRows()[0], '900 1$12')).toBeVisible();
      });
    });

    it('click edit btn', () => {
      renderEditMappingProfileRoute();

      userEvent.click(transformationsBtn('Edit transformations'));

      expect(getByText(transformationListRows()[0], '900 1$12')).toBeVisible();
    });

    describe('submitting the form', () => {
      it('should call submit callback', async () => {
        renderEditMappingProfileRouteWithMocks();

        userEvent.type(nameField(), 'New name');

        expect(saveAndCloseBtn()).toBeEnabled();

        userEvent.click(saveAndCloseBtn());

        await waitFor(() => {
          expect(handleSubmitNavigateMock).toHaveBeenCalled();
        });
      });
    });
  });
});
