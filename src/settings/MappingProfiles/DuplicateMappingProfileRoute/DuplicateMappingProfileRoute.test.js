import React from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import {
  screen,
  getByText,
  getByRole,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/testUtils';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { runAxeTest } from '@folio/stripes-testing';
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
import {
  columnHeaderFieldName, columnHeaderTransformation,
  descriptionField,
  nameField,
  recordTypeInstance, recordTypesHoldings, recordTypesItem, recordTypesSRS,
  saveAndCloseBtn, transformationListCells, transformationListRows,
  transformationsBtn,
} from '../test/setup';

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
  sendCallout = noop,
} = {}) => {
  const intl = useIntl();

  return (
    <SettingsComponentBuilder sendCallout={sendCallout}>
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

describe('rendering duplicate mapping profile page without profile data', () => {
  it('should display preloader', () => {
    renderWithIntl(
      <DuplicateMappingProfileRouteContainer profile={null} />,
      translationsProperties
    );
    expect(screen.getByTestId('fullScreen-preloader')).toBeVisible();
  });
});

describe('DuplicateMappingProfileRoute', () => {
  describe('rendering duplicate mapping profile page with profile data: success scenario', () => {
    const handleSubmitMock = jest.fn();
    const handleCancelMock = jest.fn();
    const handleSubmitNavigateMock = jest.fn();
    const sendCalloutMock = jest.fn();

    const renderDuplicateMappingProfileRoute = () => renderWithIntl(
      <DuplicateMappingProfileRouteContainer allTransformations={allMappingProfilesTransformations} />,
      translationsProperties
    );

    const renderDuplicateMappingProfileRouteWithMocks = () => renderWithIntl(
      <DuplicateMappingProfileRouteContainer
        allTransformations={allMappingProfilesTransformations}
        sendCallout={sendCalloutMock}
        onSubmit={handleSubmitMock}
        onSubmitNavigate={handleSubmitNavigateMock}
        onCancel={handleCancelMock}
      />,
      translationsProperties
    );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should display the form', () => {
      const { container } = renderDuplicateMappingProfileRoute();
      const form = container.querySelector('[data-test-full-screen-form]');

      expect(form).toBeVisible();
    });

    it('should display correct pane title', () => {
      renderDuplicateMappingProfileRoute();
      expect(screen.getByText('ui-data-export.mappingProfiles.newProfile')).toBeVisible();
    });

    it('should have correct name field value', () => {
      renderDuplicateMappingProfileRoute();
      expect(nameField()).toHaveValue('ui-data-export.copyOf');
    });

    it('should display add transformations button with proper wording', () => {
      renderDuplicateMappingProfileRoute();

      expect(screen.getByText('ui-data-export.mappingProfiles.transformations.addTransformations')).toBeVisible();
    });

    it('should have correct description field value', () => {
      renderDuplicateMappingProfileRoute();
      expect(descriptionField()).toHaveValue(mappingProfile.description);
    });

    it('should have enabled save button if there are no changes', () => {
      renderDuplicateMappingProfileRoute();
      expect(saveAndCloseBtn()).toBeEnabled();
    });

    it('should have correct folio record types field checked', () => {
      renderDuplicateMappingProfileRoute();

      expect(recordTypeInstance()).toBeChecked();
      expect(recordTypesSRS()).not.toBeChecked();
      expect(recordTypesHoldings()).not.toBeChecked();
      expect(recordTypesItem()).not.toBeChecked();
    });

    it('should display in form proper values', async () => {
      renderDuplicateMappingProfileRoute();

      userEvent.clear(nameField());
      userEvent.type(nameField(), 'Change name');
      userEvent.clear(descriptionField());
      userEvent.type(descriptionField(), 'Updated value');
      userEvent.type(recordTypesHoldings(), 'instance');
      userEvent.click(saveAndCloseBtn());

      expect(nameField()).toHaveValue('Change name');
      expect(descriptionField()).toHaveValue('Updated value');
      expect(recordTypesHoldings()).toBeChecked();
    });

    describe('clicking on cancel button', () => {
      it('should call cancel callback', () => {
        renderDuplicateMappingProfileRouteWithMocks();

        userEvent.click(screen.getByText(/cancel/i));

        expect(handleCancelMock).toHaveBeenCalled();
      });
    });

    describe('opening transformations modal', () => {
      it('should display correct transformations table with filled values', () => {
        renderDuplicateMappingProfileRoute();
        userEvent.click(transformationsBtn('ui-data-export.mappingProfiles.transformations.addTransformations'));

        expect(columnHeaderFieldName()[0]).toBeVisible();
        expect(columnHeaderTransformation()[0]).toBeVisible();
        expect(transformationListCells()).toBeVisible();
      });

      it('should fill transformation field group on transformation modal correctly', () => {
        renderDuplicateMappingProfileRoute();

        userEvent.click(transformationsBtn('ui-data-export.mappingProfiles.transformations.addTransformations'));

        const { marcFields, indicators2, indicators1, subfields } = getTransformationFieldGroups();

        expect(marcFields[2].querySelector('input')).toHaveValue('900');
        expect(indicators1[2].querySelector('input')).toHaveValue('\\');
        expect(indicators2[2].querySelector('input')).toHaveValue('1');
        expect(subfields[2].querySelector('input')).toHaveValue('12');
      });

      it('should not show validation error when clearing transformation with empty indicator field', () => {
        const { container } = renderDuplicateMappingProfileRoute();

        userEvent.click(transformationsBtn('ui-data-export.mappingProfiles.transformations.addTransformations'));

        const { marcFields, indicators2, subfields } = getTransformationFieldGroups();

        const modal = document.querySelector('[data-test-transformations-modal]');

        userEvent.type(marcFields[2].querySelector('input'), '');
        userEvent.type(indicators2[0].querySelector('input'), '');
        userEvent.type(subfields[0].querySelector('input'), '');

        userEvent.dblClick(screen.getByLabelText('ui-data-export.mappingProfiles.transformations.selectAllFields'));

        userEvent.click(getByRole(modal, 'button', { name: 'stripes-components.saveAndClose' }));
      });
    });

    it('should display transformation value', () => {
      renderDuplicateMappingProfileRoute();

      userEvent.click(transformationsBtn('ui-data-export.mappingProfiles.transformations.addTransformations'));

      expect(getByText(transformationListRows()[0], '900')).toBeVisible();
    });

    describe('submitting the form - success case', () => {
      beforeEach(() => {
        handleSubmitMock.mockImplementationOnce(() => Promise.resolve());
      });

      it('should call submit callback', () => {
        renderDuplicateMappingProfileRouteWithMocks();

        userEvent.click(saveAndCloseBtn());

        expect(handleSubmitMock).toHaveBeenCalled();
      });

      it('should initiate displaying of success callout', async () => {
        renderDuplicateMappingProfileRouteWithMocks();

        userEvent.click(saveAndCloseBtn());

        await waitFor(() => {
          expect(sendCalloutMock.mock.calls[0][0]).not.toHaveProperty('type');
          expect(sendCalloutMock.mock.calls[0][0].message.props.id).toBe('ui-data-export.mappingProfiles.create.successCallout');
          expect(handleSubmitNavigateMock).toHaveBeenCalled();
        });
      });
      it('should call submit callback with proper values', () => {
        renderDuplicateMappingProfileRouteWithMocks();

        userEvent.clear(nameField());
        userEvent.type(nameField(), 'Change name');
        userEvent.clear(descriptionField());
        userEvent.type(descriptionField(), 'Updated value');
        userEvent.click(saveAndCloseBtn());

        expect(nameField()).toHaveValue('Change name');
        expect(descriptionField()).toHaveValue('Updated value');
        expect(handleSubmitMock).toHaveBeenCalledWith(expect.objectContaining({
          name: 'Change name',
          description: 'Updated value',
        }));
      });
    });

    describe('submitting the form - error case', () => {
      beforeEach(() => {
        handleSubmitMock.mockImplementationOnce(() => Promise.reject());
      });

      it('should call submit callback', () => {
        renderDuplicateMappingProfileRouteWithMocks();

        userEvent.click(saveAndCloseBtn());

        expect(handleSubmitMock).toHaveBeenCalled();
      });

      it('should initiate displaying of error callout', async () => {
        renderDuplicateMappingProfileRouteWithMocks();

        userEvent.click(saveAndCloseBtn());

        await waitFor(() => {
          expect(sendCalloutMock).toBeCalledWith(
            expect.objectContaining({ type: 'error' })
          );
          expect(sendCalloutMock.mock.calls[0][0].message.props.id).toBe('ui-data-export.mappingProfiles.create.errorCallout');
        });
      });

      it('should render with no axe errors', async () => {
        renderDuplicateMappingProfileRouteWithMocks();

        await runAxeTest({
          rootNode: document.body,
        });
      });
    });
  });
});
