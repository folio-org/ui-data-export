import React from 'react';
import { noop } from 'lodash';
import {
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { runAxeTest } from '@folio/stripes-testing';
import { JobProfileDetails } from '.';
import { mappingProfile } from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { jobProfile } from '../../../../test/bigtest/network/scenarios/fetch-job-profiles-success';
import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { useProfileUsedInLogs } from '../../../hooks/useProfileUsedInLogs';

jest.mock('../../../hooks/useProfileUsedInLogs', () => ({
  useProfileUsedInLogs: jest.fn(),
}));

describe('JobProfileDetails', () => {
  const stripes = {
    connect: Component => props => (
      <Component
        {... props}
        mutator={{}}
        resources={{}}
      />
    ),
  };

  beforeEach(() => {
    useProfileUsedInLogs.mockReturnValue({
      isUsedInLogs: false,
      isLoading: false,
    });
  });

  const renderJobProfileDetails = () => {
    renderWithIntl(
      <SettingsComponentBuilder>
        <JobProfileDetails
          stripes={stripes}
          jobProfile={jobProfile}
          mappingProfile={mappingProfile}
          isDefaultProfile
          onCancel={noop}
          onDelete={noop}
        />
      </SettingsComponentBuilder>,
      translationsProperties
    );
  };

  it('should display job profile details', () => {
    renderJobProfileDetails();

    const dialog = screen.getByRole('dialog');

    expect(dialog).toBeVisible();

    const headings = within(dialog).getAllByRole('heading', { name: jobProfile.name });

    headings.forEach(heading => expect(heading).toBeVisible());

    const summary = within(dialog).getByRole('region', { name: /summary/i });

    const labelsAndValues = [
      'ViewMetaData',
      'ui-data-export.name',
      'A Lorem impsum 1',
      'ui-data-export.mappingProfile',
      'AP Holdings and Items',
      'ui-data-export.description',
      'Job profile description'
    ];

    labelsAndValues.forEach(el => expect(within(summary).getByText(el)).toBeVisible());
  });

  it('should display action buttons in the proper state', () => {
    renderJobProfileDetails();
    const actionButton = screen.getByText('stripes-components.paneMenuActionsToggleLabel');

    userEvent.click(actionButton);

    const deleteButton = screen.queryByText('stripes-data-transfer-components.delete');
    const duplicateButton = screen.queryByText('stripes-data-transfer-components.duplicate');
    const editButton = screen.queryByText('stripes-data-transfer-components.edit');

    expect(deleteButton).toBeNull();
    expect(duplicateButton).toBeEnabled();
    expect(editButton).toBeNull();
  });

  describe('rendering details without description for a job profile which is not already in use', () => {
    const renderJobProfileWitoutDescription = () => {
      renderWithIntl(
        <SettingsComponentBuilder>
          <JobProfileDetails
            stripes={stripes}
            jobProfile={{
              ...jobProfile,
              description: null,
            }}
            mappingProfile={mappingProfile}
            isDefaultProfile={false}
            onCancel={noop}
            onDelete={noop}
          />
        </SettingsComponentBuilder>,
        translationsProperties
      );
    };

    it('should display no value in description', () => {
      renderJobProfileWitoutDescription();
      const description = document.querySelector('[data-test-job-profile-description]');

      expect(within(description).getByText('-')).toBeVisible();
    });

    it('should render with no axe errors', async () => {
      renderJobProfileWitoutDescription();

      await runAxeTest({
        rootNode: document.body,
      });
    });

    it('should display action buttons in the proper state', () => {
      renderJobProfileWitoutDescription();
      const actionButton = screen.getByText('stripes-components.paneMenuActionsToggleLabel');

      userEvent.click(actionButton);

      const deleteButton = screen.getByText('stripes-data-transfer-components.delete');
      const duplicateButton = screen.getByText('stripes-data-transfer-components.duplicate');
      const editButton = screen.getByText('stripes-data-transfer-components.edit');

      expect(deleteButton).toBeEnabled();
      expect(duplicateButton).toBeEnabled();
      expect(editButton).toBeEnabled();
    });

    describe('clicking on delete profiles button', () => {
      it('should display delete confirmation modal', async () => {
        renderJobProfileWitoutDescription();
        const actionButton = screen.getByText('stripes-components.paneMenuActionsToggleLabel');

        userEvent.click(actionButton);

        const deleteButton = screen.getByText('stripes-data-transfer-components.delete');

        userEvent.click(deleteButton);

        const modal = screen.getAllByRole('dialog').find(dialog => within(dialog).getByRole('heading', { name: /delete/i }));

        expect(modal).toBeVisible();
        userEvent.click(within(modal).getByRole('button', { name: /cancel/i }));

        expect(modal).not.toBeVisible();
      });
    });
  });

  describe('rendering job profile details in loading state', () => {
    const renderJobProfileWithLoading = () => {
      renderWithIntl(
        <SettingsComponentBuilder>
          <JobProfileDetails
            stripes={stripes}
            isLoading
            isDefaultProfile={false}
            onCancel={noop}
            onDelete={noop}
          />
        </SettingsComponentBuilder>,
        translationsProperties
      );
    };

    it('should display preloader', () => {
      renderJobProfileWithLoading();
      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });
});
