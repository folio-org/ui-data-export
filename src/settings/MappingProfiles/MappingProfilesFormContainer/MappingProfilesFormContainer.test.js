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

      expect(getByText(headers[0], 'Summary')).toBeVisible();
      expect(getByText(headers[1], 'Transformations')).toBeVisible();
    });

    it('should place summary fields in correct order', () => {
      const labels = document.querySelectorAll('[data-test-accordion-section] label');

      expect(getByText(labels[0], 'Name')).toBeVisible();
      expect(getByText(labels[1], 'Output format')).toBeVisible();
      expect(getByText(labels[2], 'FOLIO record type')).toBeVisible();
      expect(getByText(labels[3], 'Source record storage (entire record)')).toBeVisible();
      expect(getByText(labels[4], 'Inventory instance (selected fields)')).toBeVisible();
      expect(getByText(labels[5], 'Holdings')).toBeVisible();
      expect(getByText(labels[6], 'Item')).toBeVisible();
      expect(getByText(labels[7], 'Description')).toBeVisible();
    });

    it('should disable instance record type option when selecting SRS', () => {
      userEvent.click(screen.getByRole('checkbox', { name: 'Source record storage (entire record)' }));

      expect(screen.getByDisplayValue('INSTANCE')).toBeDisabled();
    });

    it('should disable instance record type option in transformation list when selecting SRS', () => {
      userEvent.click(screen.getByRole('checkbox', { name: 'Source record storage (entire record)' }));
      userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));
      const modalRecordFilters = screen.getByRole('region', { name: 'Record type filter list' });

      expect(getByRole(modalRecordFilters, 'checkbox', { name: 'Instance' })).toBeDisabled();
    });

    it('should disable SRS record type option when selecting instance', () => {
      userEvent.click(screen.getByRole('checkbox', { name: 'Inventory instance (selected fields)' }));

      expect(screen.getByRole('checkbox', { name: 'Source record storage (entire record)' })).toBeDisabled();
    });

    it('should close transformations modal when clicking on cancel button', () => {
      userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));
      const modal = document.querySelector('.modalRoot');

      userEvent.click(getByRole(modal, 'button', { name: 'Cancel' }));

      return waitForElementToBeRemoved(() => document.querySelector('.modalRoot'));
    });

    it('should display validation error when record type is not selected', () => {
      userEvent.click(screen.getByRole('checkbox', { name: 'Item' }));
      userEvent.click(screen.getByRole('checkbox', { name: 'Item' }));

      expect(getByText(document.querySelector('[data-test-folio-record-type]'),
        'Please enter a value')).toBeVisible();
    });

    it('should display correct pane title', () => {
      expect(getByText(document.querySelector('[data-test-pane-header]'), 'New field mapping profile')).toBeVisible();
    });

    it('should not display empty transformation fields', () => {
      expect(screen.getByText('No transformations found')).toBeVisible();
    });

    it('should disable save button if there are no changes', () => {
      expect(screen.getByRole('button', { name: 'Save & close' })).toBeDisabled();
    });

    it('should not mark fields as error by default', () => {
      expect(document.querySelector('[data-test-folio-record-type-error]').childElementCount).toBe(0);
      expect(screen.getByLabelText('Name*').parentElement.classList.contains('hasError')).toBeFalsy();
    });

    describe('changing transformation field value', () => {
      let transformationFields;
      let modal;
      let transformationListRows;
      let footer;
      let formSubmitButton;

      beforeEach(() => {
        userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));
        userEvent.click(screen.getByLabelText('Select all fields'));

        transformationFields = getTransformationFieldGroups();
        modal = document.querySelector('.modalRoot');

        userEvent.type(transformationFields[0].marcField.input, '123');
        userEvent.type(transformationFields[0].indicator1.input, '1');
        userEvent.type(transformationFields[0].indicator2.input, '0');
        userEvent.type(transformationFields[0].subfield.input, '$r');

        userEvent.type(transformationFields[1].marcField.input, '900');
        userEvent.type(transformationFields[1].subfield.input, '$1');

        userEvent.click(getByRole(modal, 'button', { name: 'Save & close' }));

        transformationListRows = getAllByRole(screen.getByRole('rowgroup'), 'row');
        footer = document.querySelector('[data-test-pane-footer-end]');
        formSubmitButton = getByRole(footer, 'button', { name: 'Save & close' });
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

        userEvent.type(screen.getByLabelText('Name*'), 'Name');
        userEvent.click(getByRole(folioRecordTypeContainer, 'checkbox', { name: 'Item' }));

        userEvent.click(getByRole(footer, 'button', { name: 'Save & close' }));

        expect(getByText(document.querySelector('[data-test-folio-record-type]'),
          'Selected record types do not match specified transformations')).toBeVisible();
      });

      it('should disable submit button after clearing transformations', () => {
        userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));
        userEvent.click(screen.getByLabelText('Select all fields'));
        userEvent.click(getByRole(modal, 'button', { name: 'Save & close' }));

        expect(formSubmitButton).toBeDisabled();
      });

      it('should not display validation for record types when SRS and holdings types are checked', () => {
        const folioRecordTypeContainer = document.querySelector('[data-test-folio-record-type]');

        userEvent.type(screen.getByLabelText('Name*'), 'Name');
        userEvent.click(getByRole(folioRecordTypeContainer, 'checkbox', { name: 'Holdings' }));
        userEvent.click(screen.getByRole('checkbox', { name: 'Source record storage (entire record)' }));
        userEvent.click(getByRole(footer, 'button', { name: 'Save & close' }));

        expect(queryByText(document.querySelector('[data-test-folio-record-type]'),
          'Selected record types do not match specified transformations')).toBeNull();
        expect(onSubmitMock).toBeCalled();
      });

      describe('reopening transformation modal', () => {
        beforeEach(async () => {
          userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));
        });

        it('should display proper amount of found transformations', () => {
          const modalHeader = document.querySelector('[data-test-pane-header-sub]');

          expect(getByText(modalHeader, '2 fields found')).toBeVisible();
        });

        it('should display proper total selected count', () => {
          const totalSelected = document.querySelector('[data-test-transformations-total-selected]');

          expect(getByText(totalSelected, 'Total selected: 2')).toBeVisible();
        });

        it('should have correct placeholders', () => {
          expect(transformationFields.length).toEqual(2);

          expect(queryByPlaceholderText(transformationFields[1].marcField.container, '900')).toBeNull();
          expect(queryByPlaceholderText(transformationFields[1].indicator1.container, '0')).toBeNull();
          expect(queryByPlaceholderText(transformationFields[1].indicator2.container, '0')).toBeNull();
          expect(queryByPlaceholderText(transformationFields[1].subfield.container, '$a')).toBeNull();
        });

        it('should have correct placeholders after the first transformation is selected and hidden after the selected items filter is unchecked', () => {
          userEvent.click(screen.getAllByRole('checkbox', { name: 'Select field' })[0]);
          userEvent.click(screen.getByRole('checkbox', { name: 'Selected' }));

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
            const selectTransformationCheckboxes = screen.getAllByLabelText('Select field');

            userEvent.click(selectTransformationCheckboxes[0]);
            userEvent.click(getByRole(modal, 'button', { name: 'Cancel' }));
            userEvent.click(screen.getByRole('button', { name: 'Add transformations' }));

            const totalSelected = document.querySelector('[data-test-transformations-total-selected]');

            expect(getByText(totalSelected, 'Total selected: 2')).toBeVisible();
          });
        });
      });
    });
  });
});
