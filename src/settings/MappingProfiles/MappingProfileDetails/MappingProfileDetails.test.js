import React from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';
import {
  screen,
  getAllByRole,
  getByText,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

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

jest.mock('../../../hooks/useProfileUsedInLogs', () => ({
  useProfileUsedInLogs: jest.fn().mockReturnValue({
    isUsedInLogs: false,
    isLoading: false,
  }),
}));


const MappingProfileDetailsContainer = ({
  allTransformations = [],
  mappingProfile = mappingProfileWithTransformations,
  isDefaultProfile = false,
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
        onCancel={onCancel}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={noop}
      />
    </SettingsComponentBuilder>
  );
};

describe('MappingProfileDetails', () => {
  describe('rendering details for a default mapping profile', () => {
    const renderMappingProfileDetails = () => renderWithIntl(
      <MappingProfileDetailsContainer
        allTransformations={allMappingProfilesTransformations}
        isDefaultProfile
      />,
      translationsProperties
    );

    it('should display mapping profile details', () => {
      renderMappingProfileDetails();

      const dialog = screen.getByRole('dialog');

      expect(dialog).toBeVisible();

      const headings = within(dialog).getAllByRole('heading', { name: mappingProfileWithTransformations.name });

      headings.forEach(heading => expect(heading).toBeVisible());

      expect(within(dialog).getByRole('button', { name: 'stripes-components.collapseAll' })).toBeVisible();

      const summary = within(dialog).getByRole('region', { name: /summary/i });
      const transformations = within(dialog).getByRole('region', { name: /transformations/i });

      expect(summary).toBeVisible();
      expect(transformations).toBeVisible();

      const labelsAndValues = [
        'ViewMetaData',
        'ui-data-export.name',
        'AP Holdings 1',
        'ui-data-export.locked',
        'ui-data-export.description',
        'AP Holdings 1 description',
        'ui-data-export.outputFormat',
        'MARC',
        'stripes-data-transfer-components.folioRecordType',
        'stripes-data-transfer-components.recordTypes.holdings'
      ];

      labelsAndValues.forEach(el => expect(within(summary).getByText(el)).toBeVisible());
    });

    it('should display correct transformations fields headers', () => {
      renderMappingProfileDetails();

      expect(screen.getByRole('columnheader', { name: 'ui-data-export.mappingProfiles.transformations.fieldName' })).toBeVisible();
      expect(screen.getByRole('columnheader', { name: 'ui-data-export.mappingProfiles.transformations.field' })).toBeVisible();
      expect(screen.getByRole('columnheader', { name: 'ui-data-export.mappingProfiles.transformations.ind1' })).toBeVisible();
      expect(screen.getByRole('columnheader', { name: 'ui-data-export.mappingProfiles.transformations.ind2' })).toBeVisible();
      expect(screen.getByRole('columnheader', { name: 'ui-data-export.mappingProfiles.transformations.subfield' })).toBeVisible();
    });

    it('should display correct transformations values', () => {
      renderMappingProfileDetails();
      const transformationListRows = getAllByRole(screen.getByRole('rowgroup'), 'row');

      expect(getByText(transformationListRows[0], 'Holdings - Call number - Call number')).toBeVisible();
      expect(getByText(transformationListRows[0], '111')).toBeVisible();
      expect(getByText(transformationListRows[1], 'Holdings - Notes - Action note')).toBeVisible();
      expect(getByText(transformationListRows[1], '123')).toBeVisible();
    });
    it('should display action buttons in the proper state', () => {
      const { container } = renderMappingProfileDetails();
      const actionButton = container.querySelector('[data-test-pane-header-actions-button]');
      const disableButton = container.querySelector('[data-test-delete-profile-button]');
      const duplicateButton = container.querySelector('[data-test-duplicate-profile-button]');
      const deleteButton = container.querySelector('[data-test-delete-profile-button]');

      userEvent.click(actionButton);

      expect(disableButton).toBeNull();
      expect(duplicateButton).toBeEnabled();
      expect(deleteButton).toBeNull();
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

        expect(modal).not.toBeVisible();
      });
    });
  });
  describe('rendering mapping profile details in loading state', () => {
    it('should display preloader', () => {
      const { container } = renderWithIntl(<MappingProfileDetailsContainer
        mappingProfile={mappingProfileWithoutTransformations}
        isLoading
      />,
      translationsProperties);

      expect(container.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });
});
