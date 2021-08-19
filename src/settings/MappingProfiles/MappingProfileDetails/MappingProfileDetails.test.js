import React from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import {
  screen,
  getAllByRole,
  getByText,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { MappingProfileDetails } from '.';
import { translationsProperties } from '../../../../test/helpers';
import {
  mappingProfileWithTransformations,
  mappingProfile as mappingProfileWithoutTransformations,
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import translations from '../../../../translations/ui-data-export/en';

const MappingProfileDetailsContainer = ({
  allTransformations = [],
  mappingProfile = mappingProfileWithTransformations,
  isDefaultProfile = false,
  isProfileUsed = false,
  isLoading = false,
  onCancel = noop,
  onEdit = noop,
  onDelete = noop,
} = {}) => {
  const stripes = {
    connect: Component => props => (
      <Component
        {... props}
        mutator={{}}
        resources={{}}
      />
    ),
  };

  const intl = useIntl();

  return (
    <SettingsComponentBuilder>
      <MappingProfileDetails
        isLoading={isLoading}
        allTransformations={generateTransformationsWithDisplayName(intl, allTransformations)}
        stripes={stripes}
        mappingProfile={mappingProfile}
        isDefaultProfile={isDefaultProfile}
        isProfileUsed={isProfileUsed}
        onCancel={onCancel}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </SettingsComponentBuilder>
  );
};

describe('MappingProfileDetails', () => {
  describe('rendering details for a mapping profile which is already in use', () => {
    const renderMappingProfileDetails = () => renderWithIntl(
      <MappingProfileDetailsContainer
        allTransformations={allMappingProfilesTransformations}
        isDefaultProfile
        isProfileUsed
      />,
      translationsProperties
    );

    it('should display mapping profile details', () => {
      renderMappingProfileDetails();

      const dialog = screen.getByRole('dialog');

      expect(dialog).toBeVisible();

      const headings = within(dialog).getAllByRole('heading', { name: mappingProfileWithTransformations.name });

      headings.forEach(heading => expect(heading).toBeVisible());

      expect(within(dialog).getByRole('button', { name: /collapse all/i })).toBeVisible();

      const summary = within(dialog).getByRole('region', { name: /summary/i });
      const transformations = within(dialog).getByRole('region', { name: /transformations/i });

      expect(summary).toBeVisible();
      expect(transformations).toBeVisible();

      const labelsAndValues = [
        'Record created: 12/4/2018 1:29 AM',
        'Record last updated: 12/4/2018 1:29 AM',
        commonTranslations.name,
        'AP Holdings 1',
        translations.description,
        'AP Holdings 1 description',
        translations.outputFormat,
        'MARC',
        commonTranslations.folioRecordType,
        commonTranslations['recordTypes.holdings'],
      ];

      labelsAndValues.forEach(el => expect(within(summary).getByText(el)).toBeVisible());
    });

    it('should display correct transformations fields headers', () => {
      renderMappingProfileDetails();

      expect(screen.getByRole('columnheader', { name: translations['mappingProfiles.transformations.fieldName'] })).toBeVisible();
      expect(screen.getByRole('columnheader', { name: translations['mappingProfiles.transformations.transformation'] })).toBeVisible();
    });

    it('should display correct transformations values', () => {
      renderMappingProfileDetails();
      const transformationListRows = getAllByRole(screen.getByRole('rowgroup'), 'row');

      expect(getByText(transformationListRows[0], 'Holdings - Call number - Call number')).toBeVisible();
      expect(getByText(transformationListRows[0], '11100$a')).toBeVisible();
      expect(getByText(transformationListRows[1], 'Holdings - Notes - Action note')).toBeVisible();
      expect(getByText(transformationListRows[1], '123 1$12')).toBeVisible();
    });
    it('should display action buttons in the proper state', () => {
      const { container } = renderMappingProfileDetails();
      const actionButton = container.querySelector('[data-test-pane-header-actions-button]');
      const disableButton = container.querySelector('[data-test-delete-profile-button]');
      const duplicateButton = container.querySelector('[data-test-duplicate-profile-button]');
      const deleteButton = container.querySelector('[data-test-delete-profile-button]');

      userEvent.click(actionButton);

      expect(disableButton).toBeDisabled();
      expect(duplicateButton).toBeEnabled();
      expect(deleteButton).toBeDisabled();
    });
  });
  describe('rendering details for a mapping profile which is already in use', () => {
    const renderMappingProfileDetailsWithMapping = () => renderWithIntl(
      <MappingProfileDetailsContainer mappingProfile={mappingProfileWithoutTransformations} />,
      translationsProperties
    );

    it('should display no value in description', () => {
      const { container } = renderMappingProfileDetailsWithMapping();
      const summaryDescriptionValue = container.querySelector('[data-test-mapping-profile-description]');

      expect(getByText(summaryDescriptionValue, '-')).toBeVisible();
    });
    it('should not display delete confirmation modal', () => {
      const { container } = renderMappingProfileDetailsWithMapping();
      const deleteConfirmationModal = container.querySelector('#delete-mapping-profile-confirmation-modal');

      expect(deleteConfirmationModal).not.toBeInTheDocument();
    });
    it('should not display transformation list', () => {
      const { container } = renderMappingProfileDetailsWithMapping();
      const transformationList = container.querySelector('#mapping-profile-transformations-list');

      expect(transformationList).not.toBeInTheDocument();
    });

    it('should display action buttons enabled', () => {
      const { container } = renderMappingProfileDetailsWithMapping();
      const actionButton = container.querySelector('[data-test-pane-header-actions-button]');
      const disableButton = container.querySelector('[data-test-delete-profile-button]');
      const duplicateButton = container.querySelector('[data-test-duplicate-profile-button]');
      const deleteButton = container.querySelector('[data-test-delete-profile-button]');

      userEvent.click(actionButton);

      expect(disableButton).toBeEnabled();
      expect(duplicateButton).toBeEnabled();
      expect(deleteButton).toBeEnabled();
    });
    describe('clicking on delete profiles button', () => {
      it('should display delete confirmation modal', async () => {
        renderMappingProfileDetailsWithMapping();
        const actionButton = document.querySelector('[data-test-pane-header-actions-button]');

        userEvent.click(actionButton);

        const deleteButton = document.querySelector('[data-test-delete-profile-button]');

        userEvent.click(deleteButton);

        const modal = screen.getAllByRole('dialog').find(dialog => within(dialog).getByRole('heading', { name: /delete/i }));

        expect(modal).toBeVisible();
        userEvent.click(within(modal).getByRole('button', { name: /cancel/i }));

        await waitForElementToBeRemoved(modal);
      });
    });
  });
  describe('rendering mapping profile details in loading state', () => {
    it('should display preloader', () => {
      const { container } = renderWithIntl(<MappingProfileDetailsContainer
        mappingProfile={mappingProfileWithoutTransformations}
        isLoading
        isProfileUsed
      />,
      translationsProperties);

      expect(container.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });
});
