import React from 'react';
import { noop } from 'lodash';
import {
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '../../../../test/jest/__mock__';

import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { JobProfileDetails } from '.';
import { mappingProfile } from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { jobProfile } from '../../../../test/bigtest/network/scenarios/fetch-job-profiles-success';
import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import translations from '../../../../translations/ui-data-export/en';

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
  const renderJobProfileDetails = () => {
    renderWithIntl(
      <SettingsComponentBuilder>
        <JobProfileDetails
          stripes={stripes}
          jobProfile={jobProfile}
          mappingProfile={mappingProfile}
          isDefaultProfile
          isProfileUsed
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
      commonTranslations.name,
      jobProfile.name,
      translations.description,
      jobProfile.description,
      translations.mappingProfile,
      mappingProfile.name,
    ];

    labelsAndValues.forEach(el => expect(within(summary).getByText(el)).toBeVisible());
  });

  it('should display action buttons in the proper state', () => {
    renderJobProfileDetails();
    const actionButton = screen.getByText('Actions');

    userEvent.click(actionButton);

    const deleteButton = screen.getByText(commonTranslations.delete);
    const duplicateButton = screen.getByText(commonTranslations.duplicate);
    const editButton = screen.getByText(commonTranslations.edit);

    expect(deleteButton).toBeEnabled();
    expect(duplicateButton).toBeEnabled();
    expect(editButton).toBeEnabled();
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
            isProfileUsed={false}
            onCancel={noop}
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

    it('should display action buttons in the proper state', () => {
      renderJobProfileWitoutDescription();
      const actionButton = screen.getByText('Actions');

      userEvent.click(actionButton);

      const deleteButton = screen.getByText(commonTranslations.delete);
      const duplicateButton = screen.getByText(commonTranslations.duplicate);
      const editButton = screen.getByText(commonTranslations.edit);

      expect(deleteButton).toBeEnabled();
      expect(duplicateButton).toBeEnabled();
      expect(editButton).toBeEnabled();
    });

    describe('clicking on delete profiles button', () => {
      it('should display delete confirmation modal', async () => {
        renderJobProfileWitoutDescription();
        const actionButton = screen.getByText('Actions');

        userEvent.click(actionButton);

        const deleteButton = screen.getByText(commonTranslations.delete);

        userEvent.click(deleteButton);

        const modal = screen.getAllByRole('dialog').find(dialog => within(dialog).getByRole('heading', { name: /delete/i }));

        expect(modal).toBeVisible();
        userEvent.click(within(modal).getByRole('button', { name: /cancel/i }));

        await waitForElementToBeRemoved(modal);
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
            isProfileUsed
            onCancel={noop}
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
