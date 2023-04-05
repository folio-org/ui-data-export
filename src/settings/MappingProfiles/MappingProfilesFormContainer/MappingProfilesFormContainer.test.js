import React from 'react';
import { noop } from 'lodash';
import { useIntl } from 'react-intl';
import {
  getByRole,
  getByText,
  screen,
  getAllByRole,
  queryByPlaceholderText,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  queryByText,
  waitForElementToBeRemoved,
} from '@testing-library/dom';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import {
  SettingsComponentBuilder,
  getTransformationFieldGroups,
} from '../../../../test/jest/helpers';
import { MappingProfilesFormContainer } from './MappingProfilesFormContainer';
import {
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { translationsProperties } from '../../../../test/helpers';

const MappingProfileFormContainer = ({
  allTransformations,
  contentLabel = 'label',
  isEditMode = false,
  initialValues = {
    transformations: [],
    records: [],
    recordTypes: [],
    outputFormat: 'MARC',
  },
  onSubmit = noop,
  onCancel = noop,
}) => {
  const intl = useIntl();

  return (
    <SettingsComponentBuilder>
      <MappingProfilesFormContainer
        allTransformations={generateTransformationsWithDisplayName(intl, allTransformations)}
        contentLabel={contentLabel}
        isEditMode={isEditMode}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </SettingsComponentBuilder>
  );
};

describe('MappingProfileFormContainer', () => {
  describe('rendering MappingProfileForm', () => {
    const onSubmitMock = jest.fn();

    beforeEach(() => {
      renderWithIntl(
        <MappingProfileFormContainer
          allTransformations={allMappingProfilesTransformations}
          onSubmit={onSubmitMock}
        />,
        translationsProperties
      );
    });

    it('should place accordion headers in correct order', () => {
      const headers = document.querySelectorAll('[data-test-headline]');

      expect(getByText(headers[0], 'ui-data-export.summary')).toBeVisible();
      expect(getByText(headers[1], 'ui-data-export.transformations')).toBeVisible();
    });

    it('should place summary fields in correct order', () => {
      const labels = document.querySelectorAll('[data-test-accordion-section] label');

      expect(getByText(labels[0], 'stripes-data-transfer-components.name')).toBeVisible();
      expect(getByText(labels[1], 'ui-data-export.outputFormat')).toBeVisible();
      expect(getByText(labels[2], 'stripes-data-transfer-components.folioRecordType')).toBeVisible();
      expect(getByText(labels[3], 'stripes-data-transfer-components.recordTypes.srs')).toBeVisible();
      expect(getByText(labels[4], 'ui-data-export.mappingProfiles.recordType.instance')).toBeVisible();
      expect(getByText(labels[5], 'stripes-data-transfer-components.recordTypes.holdings')).toBeVisible();
      expect(getByText(labels[6], 'stripes-data-transfer-components.recordTypes.item')).toBeVisible();
      expect(getByText(labels[7], 'ui-data-export.description')).toBeVisible();
    });

    it('should disable instance record type option when selecting SRS', () => {
      userEvent.click(screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.srs' }));

      expect(screen.getByDisplayValue('INSTANCE')).toBeDisabled();
    });

    it('should disable instance record type option in transformation list when selecting SRS', () => {
      userEvent.click(screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.srs' }));
      userEvent.click(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' }));
      const modalRecordFilters = screen.getByRole('region', { name: 'ui-data-export.recordType filter list' });

      expect(getByRole(modalRecordFilters, 'checkbox', { name: 'stripes-data-transfer-components.recordTypes.instance' })).toBeDisabled();
    });

    it('should disable SRS record type option when selecting instance', () => {
      userEvent.click(screen.getByRole('checkbox', { name: 'ui-data-export.mappingProfiles.recordType.instance' }));

      expect(screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.srs' })).toBeDisabled();
    });

    it('should close transformations modal when clicking on cancel button', () => {
      userEvent.click(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' }));
      const modal = document.querySelector('.modalRoot');

      userEvent.click(getByRole(modal, 'button', { name: 'stripes-components.cancel' }));

      return waitForElementToBeRemoved(() => document.querySelector('.modalRoot'));
    });

    it('should display validation error when record type is not selected', () => {
      userEvent.click(screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.item' }));
      userEvent.click(screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.item' }));

      expect(getByText(document.querySelector('[data-test-folio-record-type]'),
        'stripes-data-transfer-components.validation.enterValue')).toBeVisible();
    });

    it('should display correct pane title', () => {
      expect(getByText(document.querySelector('[data-test-pane-header]'), 'ui-data-export.mappingProfiles.newProfile')).toBeVisible();
    });

    it('should not display empty transformation fields', () => {
      expect(screen.getByText('ui-data-export.mappingProfiles.transformations.emptyMessage')).toBeVisible();
    });

    it('should disable save button if there are no changes', () => {
      expect(screen.getByRole('button', { name: 'stripes-components.saveAndClose' })).toBeDisabled();
    });

    it('should not mark fields as error by default', () => {
      expect(document.querySelector('[data-test-folio-record-type-error]').childElementCount).toBe(0);
    });

    describe('changing transformation field value', () => {
      let transformationFields;
      let modal;
      let transformationListRows;
      let footer;
      let formSubmitButton;

      beforeEach(() => {
        userEvent.click(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' }));
        userEvent.click(screen.getByLabelText('ui-data-export.mappingProfiles.transformations.selectAllFields'));

        transformationFields = getTransformationFieldGroups();
        modal = document.querySelector('.modalRoot');

        userEvent.type(transformationFields[0].marcField.input, '123');
        userEvent.type(transformationFields[0].indicator1.input, '1');
        userEvent.type(transformationFields[0].indicator2.input, '0');
        userEvent.type(transformationFields[0].subfield.input, '$r');

        userEvent.type(transformationFields[1].marcField.input, '900');
        userEvent.type(transformationFields[1].subfield.input, '$1');

        userEvent.click(getByRole(modal, 'button', { name: 'stripes-components.saveAndClose' }));

        transformationListRows = getAllByRole(screen.getByRole('rowgroup'), 'row');
        footer = document.querySelector('[data-test-pane-footer-end]');
        formSubmitButton = getByRole(footer, 'button', { name: 'stripes-components.saveAndClose' });
      });

      it('should select all and add transformations with values', () => {
        expect(transformationListRows.length).toBe(2);
        expect(getByText(transformationListRows[0], '12310$r')).toBeVisible();
        expect(getByText(transformationListRows[1], '900 $1')).toBeVisible();
      });

      it('should enable submit button', () => {
        expect(formSubmitButton).not.toBeDisabled();
      });

      it('should display validation error when transformations do not match record type', () => {
        const folioRecordTypeContainer = document.querySelector('[data-test-folio-record-type]');

        userEvent.type(screen.getByRole('textbox', {name: 'stripes-data-transfer-components.name'}), 'Name');
        userEvent.click(getByRole(folioRecordTypeContainer, 'checkbox', { name: 'stripes-data-transfer-components.recordTypes.item' }));

        userEvent.click(getByRole(footer, 'button', { name: 'stripes-components.saveAndClose' }));

        expect(getByText(document.querySelector('[data-test-folio-record-type]'),
          'ui-data-export.mappingProfiles.validation.recordTypeMismatch')).toBeVisible();
      });

      it('should disable submit button after clearing transformations', () => {
        userEvent.click(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' }));
        userEvent.click(screen.getByLabelText('ui-data-export.mappingProfiles.transformations.selectAllFields'));
        userEvent.click(getByRole(modal, 'button', { name: 'stripes-components.saveAndClose' }));

        expect(formSubmitButton).toBeDisabled();
      });

      it('should not display validation for record types when SRS and holdings types are checked', () => {
        const folioRecordTypeContainer = document.querySelector('[data-test-folio-record-type]');

        userEvent.type(screen.getByRole('textbox', {name: 'stripes-data-transfer-components.name'}), 'Name');
        userEvent.click(getByRole(folioRecordTypeContainer, 'checkbox', { name: 'stripes-data-transfer-components.recordTypes.holdings' }));
        userEvent.click(screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.srs' }));
        userEvent.click(getByRole(footer, 'button', { name: 'stripes-components.saveAndClose' }));

        expect(queryByText(document.querySelector('[data-test-folio-record-type]'),
          'ui-data-export.mappingProfiles.validation.recordTypeMismatch')).toBeNull();
        expect(onSubmitMock).toBeCalled();
      });

      describe('reopening transformation modal', () => {
        beforeEach(async () => {
          userEvent.click(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' }));
        });

        it('should display proper amount of found transformations', () => {
          const modalHeader = document.querySelector('[data-test-pane-header-sub]');

          expect(getByText(modalHeader, 'ui-data-export.mappingProfiles.transformations.searchResultsCountHeader')).toBeVisible();
        });

        it('should display proper total selected count', () => {
          const totalSelected = document.querySelector('[data-test-transformations-total-selected]');

          expect(getByText(totalSelected, 'ui-data-export.modal.totalSelected')).toBeVisible();
        });

        it('should have correct placeholders', () => {
          expect(transformationFields.length).toEqual(2);

          expect(queryByPlaceholderText(transformationFields[1].marcField.container, '900')).toBeNull();
          expect(queryByPlaceholderText(transformationFields[1].indicator1.container, '0')).toBeNull();
          expect(queryByPlaceholderText(transformationFields[1].indicator2.container, '0')).toBeNull();
          expect(queryByPlaceholderText(transformationFields[1].subfield.container, '$a')).toBeNull();
        });

        it('should have correct placeholders after the first transformation is selected and hidden after the selected items filter is unchecked', () => {
          userEvent.click(screen.getAllByRole('checkbox', { name: 'ui-data-export.mappingProfiles.transformations.selectField' })[0]);
          userEvent.click(screen.getByRole('checkbox', { name: 'ui-data-export.selected' }));

          transformationFields = getTransformationFieldGroups();

          expect(transformationFields.length).toEqual(1);

          expect(queryByPlaceholderText(transformationFields[0].marcField.container, '900')).toBeNull();
          expect(queryByPlaceholderText(transformationFields[0].indicator1.container, '0')).toBeNull();
          expect(queryByPlaceholderText(transformationFields[0].indicator2.container, '0')).toBeNull();
          expect(queryByPlaceholderText(transformationFields[0].subfield.container, '$a')).toBeNull();
        });

        it('should display correct transformation fields values', () => {
          expect(transformationFields[0].marcField.input.value).toBe('123');
          expect(transformationFields[0].indicator1.input.value).toBe('1');
          expect(transformationFields[0].indicator2.input.value).toBe('0');
          expect(transformationFields[0].subfield.input.value).toBe('$r');

          expect(transformationFields[1].marcField.input.value).toBe('900');
          expect(transformationFields[1].indicator1.input.value).toBe('');
          expect(transformationFields[1].indicator2.input.value).toBe('');
          expect(transformationFields[1].indicator2.input.value).toBe('');
          expect(transformationFields[1].subfield.input.value).toBe('$1');
        });

        describe('unchecking transformation, clicking cancel and reopening modal', () => {
          it('should display correct selected field count', () => {
            const selectTransformationCheckboxes = screen.getAllByLabelText('ui-data-export.mappingProfiles.transformations.selectField');

            userEvent.click(selectTransformationCheckboxes[0]);
            userEvent.click(getByRole(modal, 'button', { name: 'stripes-components.cancel' }));
            userEvent.click(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' }));

            const totalSelected = document.querySelector('[data-test-transformations-total-selected]');

            expect(getByText(totalSelected, 'ui-data-export.modal.totalSelected')).toBeVisible();
          });
        });
      });
    });
  });
});
