import React from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import {
  screen,
  getAllByRole,
  getByText,
  getByRole,
  waitForElementToBeRemoved,
  waitFor,
  within,
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
import translations from '../../../../translations/ui-data-export/en';

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
    expect(screen.getByTestId('preloader')).toBeVisible();
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
      const paneHeader = screen.getByRole('heading', { name: 'New field mapping profile' });

      expect(getByText(paneHeader, translations['mappingProfiles.newProfile'])).toBeVisible();
    });
    it('should have correct name field value', () => {
      renderDuplicateMappingProfileRoute();
      expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue(`Copy of ${mappingProfile.name}`);
    });

    it('should display add transformations button with proper wording', () => {
      renderDuplicateMappingProfileRoute();
      const addTranslationBtn = screen.getByRole('button', { name: 'Add transformations' });

      expect(getByText(addTranslationBtn, translations['mappingProfiles.transformations.addTransformations'])).toBeVisible();
    });

    it('should have correct description field value', () => {
      renderDuplicateMappingProfileRoute();
      expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(mappingProfile.description);
    });

    it('should have enabled save button if there are no changes', () => {
      renderDuplicateMappingProfileRoute();
      expect(screen.getByRole('button', { name: 'Save & close' })).toBeEnabled();
    });

    it('should have correct folio record types field checked', () => {
      renderDuplicateMappingProfileRoute();
      const recordTypeInstance = screen.getByRole('checkbox', { name: /instance/i });
      const recordTypesSRS = screen.getByRole('checkbox', { name: /source record storage/i });
      const recordTypesHoldings = screen.getByRole('checkbox', { name: /holdings/i });
      const recordTypesItem = screen.getByRole('checkbox', { name: /item/i });

      expect(recordTypeInstance).toBeChecked();
      expect(recordTypesSRS).not.toBeChecked();
      expect(recordTypesHoldings).not.toBeChecked();
      expect(recordTypesItem).not.toBeChecked();
    });

    it('should display in form proper values', async () => {
      renderDuplicateMappingProfileRoute();
      const nameField = screen.getByRole('textbox', { name: /name/i });
      const descriptionField = screen.getByRole('textbox', { name: /description/i });
      const recordTypesHoldings = screen.getByRole('checkbox', { name: /holdings/i });

      userEvent.clear(nameField);
      userEvent.type(nameField, 'Change name');
      userEvent.clear(descriptionField);
      userEvent.type(descriptionField, 'Updated value');
      userEvent.type(recordTypesHoldings, 'instance');
      userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

      expect(nameField).toHaveValue('Change name');
      expect(descriptionField).toHaveValue('Updated value');
      expect(recordTypesHoldings).toBeChecked();
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
        userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));

        const transformationListRows = getAllByRole(screen.getByRole('rowgroup'), 'row');
        const transformationListCells = within(transformationListRows[0]).getByText('Instance - Resource title');
        const columnHeaderFieldName = screen.getAllByRole('columnheader', { name: translations['mappingProfiles.transformations.fieldName'] });
        const columnHeaderTransformation = screen.getAllByRole('columnheader', { name: translations['mappingProfiles.transformations.transformation'] });

        expect(columnHeaderFieldName[0]).toBeVisible();
        expect(columnHeaderTransformation[0]).toBeVisible();
        expect(transformationListCells).toBeVisible();
      });
      it('should fill transformation field group on transformation modal correctly', () => {
        renderDuplicateMappingProfileRoute();

        userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));

        const transformationFields = getTransformationFieldGroups();

        expect(transformationFields[2].marcField.input.value).toBe('900');
        expect(transformationFields[2].indicator1.input.value).toBe('');
        expect(transformationFields[2].indicator2.input.value).toBe('1');
        expect(transformationFields[2].subfield.input.value).toBe('$12');
      });
      it('should not show validation error when clearing transformation with empty indicator field', () => {
        const { container } = renderDuplicateMappingProfileRoute();

        userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));

        const transformationFields = getTransformationFieldGroups();
        const modal = document.querySelector('[data-test-transformations-modal]');

        userEvent.type(transformationFields[2].marcField.input, '');
        userEvent.type(transformationFields[0].indicator2.input, '');
        userEvent.type(transformationFields[0].subfield.input, '');

        userEvent.dblClick(screen.getByLabelText('Select all fields'));

        userEvent.click(getByRole(modal, 'button', { name: 'Save & close' }));

        return waitForElementToBeRemoved(() => container.querySelector('[data-test-transformations-modal]'));
      });
    });

    it('should display transformation value', () => {
      renderDuplicateMappingProfileRoute();

      userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));

      const transformationListRows = getAllByRole(screen.getByRole('rowgroup'), 'row');

      expect(getByText(transformationListRows[0], '900 1$12')).toBeVisible();
    });

    describe('submitting the form - success case', () => {
      beforeEach(() => {
        handleSubmitMock.mockImplementationOnce(() => Promise.resolve());
      });

      it('should call submit callback', () => {
        renderDuplicateMappingProfileRouteWithMocks();

        userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

        expect(handleSubmitMock).toHaveBeenCalled();
      });

      it('should initiate displaying of success callout', async () => {
        renderDuplicateMappingProfileRouteWithMocks();

        userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

        await waitFor(() => {
          expect(sendCalloutMock.mock.calls[0][0]).not.toHaveProperty('type');
          expect(sendCalloutMock.mock.calls[0][0].message.props.id).toBe('ui-data-export.mappingProfiles.create.successCallout');
          expect(handleSubmitNavigateMock).toHaveBeenCalled();
        });
      });
      it('should call submit callback with proper values', () => {
        renderDuplicateMappingProfileRouteWithMocks();
        const nameField = screen.getByRole('textbox', { name: /name/i });
        const descriptionField = screen.getByRole('textbox', { name: 'Description' });

        userEvent.clear(nameField);
        userEvent.type(nameField, 'Change name');
        userEvent.clear(descriptionField);
        userEvent.type(descriptionField, 'Updated value');
        userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

        expect(nameField).toHaveValue('Change name');
        expect(descriptionField).toHaveValue('Updated value');
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

        userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

        expect(handleSubmitMock).toHaveBeenCalled();
      });

      it('should initiate displaying of error callout', async () => {
        renderDuplicateMappingProfileRouteWithMocks();

        userEvent.click(screen.getByRole('button', { name: 'Save & close' }));

        await waitFor(() => {
          expect(sendCalloutMock).toBeCalledWith(
            expect.objectContaining({ type: 'error' })
          );
          expect(sendCalloutMock.mock.calls[0][0].message.props.id).toBe('ui-data-export.mappingProfiles.create.errorCallout');
        });
      });
    });
  });
});
