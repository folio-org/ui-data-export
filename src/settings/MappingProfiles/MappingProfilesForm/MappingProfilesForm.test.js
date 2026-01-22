import React from 'react';
import { noop } from 'lodash';
import { useIntl } from 'react-intl';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { runAxeTest } from '@folio/stripes-testing';

import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { MappingProfilesForm } from './MappingProfilesForm';
import {
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { translationsProperties } from '../../../../test/helpers';

const MappingProfilesFormContainer = ({
  allTransformations = [],
  transformations = [],
  isEditMode = false,
  hasLockPermissions = false,
  initialValues = {
    transformations: [],
    recordTypes: [],
    outputFormat: 'MARC',
  },
  onSubmit = noop,
  onCancel = noop,
  onAddTransformations = noop,
  onTypeDisable = noop,
  title,
  metadata,
}) => {
  const intl = useIntl();

  return (
    <SettingsComponentBuilder>
      <MappingProfilesForm
        allTransformations={generateTransformationsWithDisplayName(intl, allTransformations)}
        transformations={transformations}
        isEditMode={isEditMode}
        hasLockPermissions={hasLockPermissions}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onAddTransformations={onAddTransformations}
        onTypeDisable={onTypeDisable}
        title={title}
        metadata={metadata}
      />
    </SettingsComponentBuilder>
  );
};

describe('MappingProfilesForm', () => {
  describe('rendering form with default props', () => {
    beforeEach(() => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );
    });

    it('should display the form', () => {
      const form = document.querySelector('[data-test-full-screen-form]');

      expect(form).toBeVisible();
    });

    it('should render name field', () => {
      const nameField = document.querySelector('[data-test-mapping-profile-form-name]');

      expect(nameField).toBeInTheDocument();
    });

    it('should render output format field', () => {
      const outputFormatField = document.querySelector('[data-test-mapping-profile-output-format]');

      expect(outputFormatField).toBeInTheDocument();
    });

    it('should render description field', () => {
      const descriptionField = document.querySelector('[data-test-mapping-profile-description]');

      expect(descriptionField).toBeInTheDocument();
    });

    it('should render fields suppression field', () => {
      const fieldsSuppressionField = document.querySelector('[data-test-mapping-profile-fieldsSuppression]');

      expect(fieldsSuppressionField).toBeInTheDocument();
    });

    it('should render suppress 999ff checkbox', () => {
      const suppress999ffField = document.querySelector('[data-test-mapping-profile-suppress999ff]');

      expect(suppress999ffField).toBeInTheDocument();
    });

    it('should render lock profile checkbox', () => {
      const lockedField = document.querySelector('[data-test-mapping-profile-locked]');

      expect(lockedField).toBeInTheDocument();
    });

    it('should have submit button disabled initially', () => {
      const submitButton = screen.getByRole('button', { name: 'stripes-components.saveAndClose' });

      expect(submitButton).toBeDisabled();
    });
  });

  describe('lock profile checkbox behavior', () => {
    describe('when user does NOT have lock permissions', () => {
      beforeEach(() => {
        renderWithIntl(
          <MappingProfilesFormContainer
            allTransformations={allMappingProfilesTransformations}
            hasLockPermissions={false}
          />,
          translationsProperties
        );
      });

      it('should render lock profile checkbox as disabled', () => {
        const lockCheckbox = screen.getByRole('checkbox', { name: 'ui-data-export.locked' });

        expect(lockCheckbox).toBeDisabled();
      });
    });

    describe('when user has lock permissions', () => {
      beforeEach(() => {
        renderWithIntl(
          <MappingProfilesFormContainer
            allTransformations={allMappingProfilesTransformations}
            hasLockPermissions
          />,
          translationsProperties
        );
      });

      it('should render lock profile checkbox as enabled', () => {
        const lockCheckbox = screen.getByRole('checkbox', { name: 'ui-data-export.locked' });

        expect(lockCheckbox).toBeEnabled();
      });

      it('should allow toggling the lock checkbox', () => {
        const lockCheckbox = screen.getByRole('checkbox', { name: 'ui-data-export.locked' });

        expect(lockCheckbox).not.toBeChecked();

        userEvent.click(lockCheckbox);

        expect(lockCheckbox).toBeChecked();
      });
    });
  });

  describe('fields suppression behavior', () => {
    it('should disable fields suppression when no record types are selected', () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );

      const fieldsSuppressionTextarea = document.querySelector('#mapping-profile-fieldsSuppression');

      expect(fieldsSuppressionTextarea).toBeDisabled();
    });

    it('should enable fields suppression when holdings record type is selected', async () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );

      const holdingsCheckbox = screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.holdings' });

      userEvent.click(holdingsCheckbox);

      await waitFor(() => {
        const fieldsSuppressionTextarea = document.querySelector('#mapping-profile-fieldsSuppression');

        expect(fieldsSuppressionTextarea).toBeEnabled();
      });
    });

    it('should disable fields suppression when only item record type is selected', async () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );

      const itemCheckbox = screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.item' });

      userEvent.click(itemCheckbox);

      await waitFor(() => {
        const fieldsSuppressionTextarea = document.querySelector('#mapping-profile-fieldsSuppression');

        expect(fieldsSuppressionTextarea).toBeDisabled();
      });
    });

    it('should clear fieldsSuppression value when the field becomes disabled', async () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );

      const fieldsSuppressionTextarea = document.querySelector('#mapping-profile-fieldsSuppression');

      // Initially the field should be disabled (no record types selected)
      expect(fieldsSuppressionTextarea).toBeDisabled();

      // Select holdings to enable the field
      const holdingsCheckbox = screen.getByRole('checkbox', { name: 'stripes-data-transfer-components.recordTypes.holdings' });

      userEvent.click(holdingsCheckbox);

      await waitFor(() => {
        expect(fieldsSuppressionTextarea).toBeEnabled();
      });

      // Type a value into the field
      userEvent.type(fieldsSuppressionTextarea, '123,456');

      await waitFor(() => {
        expect(fieldsSuppressionTextarea.value).toBe('123,456');
      });

      // Unselect holdings to disable the field - this should clear the value
      userEvent.click(holdingsCheckbox);

      await waitFor(() => {
        expect(fieldsSuppressionTextarea).toBeDisabled();
        expect(fieldsSuppressionTextarea.value).toBe('');
      });
    });
  });

  describe('form submission', () => {
    it('should enable submit button when form is dirty', async () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );

      const nameInput = document.querySelector('#mapping-profile-name');

      userEvent.type(nameInput, 'Test Profile');

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: 'stripes-components.saveAndClose' });

        expect(submitButton).toBeEnabled();
      });
    });

    it('should call onCancel when cancel button is clicked', () => {
      const onCancel = jest.fn();

      const { container } = renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
          onCancel={onCancel}
        />,
        translationsProperties
      );

      const cancelButton = container.querySelector('[data-test-full-screen-form] button[type="button"]');

      userEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('edit mode', () => {
    it('should display edit transformations button text in edit mode', () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
          isEditMode
        />,
        translationsProperties
      );

      expect(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.editTransformations' })).toBeVisible();
    });

    it('should display add transformations button text in create mode', () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
          isEditMode={false}
        />,
        translationsProperties
      );

      expect(screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' })).toBeVisible();
    });
  });

  describe('add transformations button', () => {
    it('should call onAddTransformations when button is clicked', () => {
      const onAddTransformations = jest.fn();

      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
          onAddTransformations={onAddTransformations}
        />,
        translationsProperties
      );

      const addTransformationsButton = screen.getByRole('button', { name: 'ui-data-export.mappingProfiles.transformations.addTransformations' });

      userEvent.click(addTransformationsButton);

      expect(onAddTransformations).toHaveBeenCalledTimes(1);
    });
  });

  describe('accordion behavior', () => {
    it('should display expand all button', () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );

      expect(screen.getByRole('button', { name: 'stripes-components.collapseAll' })).toBeVisible();
    });

    it('should display summary accordion', () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );

      expect(screen.getByRole('button', { name: /ui-data-export.summary/i })).toBeVisible();
    });

    it('should display transformations accordion', () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );

      expect(screen.getByRole('button', { name: /ui-data-export.transformations/i })).toBeVisible();
    });
  });

  describe('with initial locked value', () => {
    it('should display lock checkbox as checked when initial value is locked', () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
          hasLockPermissions
          initialValues={{
            transformations: [],
            recordTypes: [],
            outputFormat: 'MARC',
            locked: true,
          }}
        />,
        translationsProperties
      );

      const lockCheckbox = screen.getByRole('checkbox', { name: 'ui-data-export.locked' });

      expect(lockCheckbox).toBeChecked();
    });

    it('should display lock checkbox as unchecked when initial value is not locked', () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
          hasLockPermissions
          initialValues={{
            transformations: [],
            recordTypes: [],
            outputFormat: 'MARC',
            locked: false,
          }}
        />,
        translationsProperties
      );

      const lockCheckbox = screen.getByRole('checkbox', { name: 'ui-data-export.locked' });

      expect(lockCheckbox).not.toBeChecked();
    });
  });

  describe('accessibility', () => {
    it('should not have any a11y issues', async () => {
      renderWithIntl(
        <MappingProfilesFormContainer
          allTransformations={allMappingProfilesTransformations}
        />,
        translationsProperties
      );

      await runAxeTest({ rootNode: document.body });
    });
  });
});
