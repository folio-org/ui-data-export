import React from 'react';
import { noop } from 'lodash';
import {
  getByRole,
  getByText,
  screen,
  getAllByRole,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { Layer } from '@folio/stripes/components';

import {
  SettingsComponentBuilder,
  getTransformationFieldGroups,
} from '../../../../test/jest/helpers';
import { translationsProperties } from '../../../../test/helpers';
import { MappingProfilesTransformationsModal } from './MappingProfilesTransformationsModal';

const initialValues = {
  transformations: [
    {
      displayName: 'Holdings - Effective call number',
      recordType: 'HOLDINGS',
      fieldId: 'field1',
      order: 0,
    },
    {
      displayName: 'Instances - Call number - prefix',
      recordType: 'INSTANCE',
      fieldId: 'field2',
      order: 1,
    },
    {
      displayName: 'Items - Electronic access - Link text Items',
      recordType: 'ITEM',
      fieldId: 'field3',
      order: 2,
    },
  ],
};

const MappingProfilesTransformationModalContainer = ({
  isOpen = true,
  initialTransformationsValues = initialValues,
  initialSelectedTransformations = {},
  disabledRecordTypes = {},
  onCancel = noop,
  onSubmit = noop,
}) => {
  return (
    <SettingsComponentBuilder>
      <Layer
        isOpen
        contentLabel="label"
      >
        <MappingProfilesTransformationsModal
          isOpen={isOpen}
          initialTransformationsValues={initialTransformationsValues}
          initialSelectedTransformations={initialSelectedTransformations}
          disabledRecordTypes={disabledRecordTypes}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Layer>
    </SettingsComponentBuilder>
  );
};

describe('MappingProfilesTransformationsModal', () => {
  describe('rendering mapping profile transformations modal', () => {
    const onSubmitMock = jest.fn();
    let modal;

    beforeEach(() => {
      renderWithIntl(
        <MappingProfilesTransformationModalContainer
          onSubmit={onSubmitMock}
        />,
        translationsProperties
      );
      modal = document.querySelector('[data-test-transformations-modal]');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should display transformations modal', () => {
      expect(modal).toBeInTheDocument();
    });

    it('should display search pane', () => {
      expect(modal.querySelector('[data-test-transformations-search-pane]')).toBeInTheDocument();
    });

    it('should display results pane', () => {
      const resultsPane = modal.querySelector('[data-test-transformations-results-pane]');

      expect(resultsPane).toBeInTheDocument();
      expect(getByText(resultsPane, 'Transformations')).toBeInTheDocument();
      expect(getByText(resultsPane, `${initialValues.transformations.length} fields found`)).toBeInTheDocument();
    });

    it('should display total selected count', () => {
      expect(getByText(modal, 'Total selected: 0')).toBeInTheDocument();
    });

    it('should display search form', () => {
      expect(modal.querySelector('[data-test-transformations-search-form]')).toBeInTheDocument();
    });

    it('should display correct folio record types', () => {
      const checkboxes = getAllByRole(modal, 'checkbox');

      expect(checkboxes[0].value).toBe('INSTANCE');
      expect(checkboxes[1].value).toBe('HOLDINGS');
      expect(checkboxes[2].value).toBe('ITEM');
    });

    it('should display cancel button', () => {
      expect(getByRole(modal, 'button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should display save button', () => {
      expect(getByRole(modal, 'button', { name: 'Save & close' })).toBeInTheDocument();
    });

    describe('filling transformation values', () => {
      let transformationFields;
      let submitButton;

      beforeEach(() => {
        transformationFields = getTransformationFieldGroups();
        submitButton = getByRole(modal, 'button', { name: 'Save & close' });
        userEvent.type(transformationFields[0].marcField, '123');
        userEvent.type(transformationFields[0].indicator1, '1');
        userEvent.type(transformationFields[0].indicator2, '0');
        userEvent.type(transformationFields[0].subfield, '$r');
      });

      it('should enable submit button', () => {
        expect(submitButton).not.toBeDisabled();
      });

      it('should validate fields as valid and initiate modal submit', () => {
        userEvent.click(submitButton);

        expect(onSubmitMock).toBeCalled();
      });

      describe('selecting all fields and clicking submit', () => {
        beforeEach(() => {
          userEvent.click(screen.getByLabelText('Select all fields'));
          userEvent.click(submitButton);
          transformationFields = getTransformationFieldGroups();
        });

        it('should not initiate modal submit', () => {
          expect(onSubmitMock).not.toBeCalled();
        });

        it('should disable submit button', () => {
          expect(submitButton).toBeDisabled();
        });

        it('should validate instance record type transformation as valid (instances can be empty)', () => {
          expect(transformationFields[1].isInvalid).toBe(false);
        });

        it('should validate item record type transformation as invalid', () => {
          expect(transformationFields[2].isInvalid).toBe(true);
        });

        describe('filling empty invalid field with invalid transformation', () => {
          beforeEach(() => {
            userEvent.type(transformationFields[2].marcField, '123');
            userEvent.type(transformationFields[2].subfield, '12');
            userEvent.click(submitButton);
            transformationFields = getTransformationFieldGroups();
          });

          it('should mark field as invalid', () => {
            expect(transformationFields[2].isInvalid).toBe(true);
          });
        });

        describe('filling empty invalid field with valid transformation', () => {
          beforeEach(() => {
            userEvent.type(transformationFields[2].marcField, '900');
            userEvent.type(transformationFields[2].indicator1, 'r');
            userEvent.type(transformationFields[2].indicator2, '1');
            userEvent.type(transformationFields[2].subfield, '$90');
            userEvent.click(submitButton);
          });

          it('should validate fields as valid and initiate modal submit', () => {
            expect(onSubmitMock).toBeCalledWith([{
              enabled: true,
              fieldId: 'field1',
              rawTransformation: {
                marcField: '123',
                indicator1: '1',
                indicator2: '0',
                subfield: '$r',
              },
              recordType: 'HOLDINGS',
              transformation: '12310$r',
            }, {
              enabled: true,
              fieldId: 'field2',
              recordType: 'INSTANCE',
              transformation: '',
            }, {
              enabled: true,
              fieldId: 'field3',
              rawTransformation: {
                marcField: '900',
                indicator1: 'r',
                indicator2: '1',
                subfield: '$90',
              },
              recordType: 'ITEM',
              transformation: '900r1$90',
            }]);
          });
        });
      });
    });
  });
});