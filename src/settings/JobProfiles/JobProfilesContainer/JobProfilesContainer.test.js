import React from 'react';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { noop } from 'lodash';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { JobProfilesContainer } from './index';

jest.mock('../CreateJobProfileRoute', () => ({
  CreateJobProfileRoute: () => <div>CreateJobProfileRoute</div>,
}));

jest.mock('../EditJobProfileRoute', () => ({
  EditJobProfileRoute: () => <div>EditJobProfileRoute</div>,
}));

jest.mock('../DuplicateJobProfileRoute', () => ({
  DuplicateJobProfileRoute: () => <div>DuplicateJobProfileRoute</div>,
}));

const setupJobProfilesContainer = initialEntries => {
  renderWithIntl(
    <SettingsComponentBuilder>
      <MemoryRouter initialEntries={initialEntries}>
        <JobProfilesContainer
          resources={{
            jobProfiles: {
              hasLoaded: true,
              records: [],
              other: {
                totalRecords: 0,
              },
            },
          }}
          mutator={{ jobProfiles: { POST: noop } }}
          match={{ params: { }, path: '/data-export/job-profiles', url: '/' }}
        />
      </MemoryRouter>,
    </SettingsComponentBuilder>,
    translationsProperties
  );
};

describe('JobProfilesContainer', () => {
  it('should render create job profile', async () => {
    setupJobProfilesContainer(['/data-export/job-profiles/create']);

    const createJobProfile = await screen.findByText(/CreateJobProfileRoute/i);

    expect(createJobProfile).toBeVisible();
  });

  it('should render with no axe errors on create route', async () => {
    setupJobProfilesContainer(['/data-export/job-profiles/create']);

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render edit job profile', async () => {
    setupJobProfilesContainer(['/data-export/job-profiles/edit/1']);

    const editJobProfile = await screen.findByText(/EditJobProfileRoute/i);

    expect(editJobProfile).toBeVisible();
  });

  it('should render with no axe errors on edit route', async () => {
    setupJobProfilesContainer(['/data-export/job-profiles/edit/1']);

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should render duplicate job profile', async () => {
    setupJobProfilesContainer(['/data-export/job-profiles/duplicate/1']);

    const duplicateJobProfile = await screen.findByText(/DuplicateJobProfileRoute/i);

    expect(duplicateJobProfile).toBeVisible();
  });

  it('should render with no axe errors on duplicate route', async () => {
    setupJobProfilesContainer(['/data-export/job-profiles/duplicate/1']);

    await runAxeTest({
      rootNode: document.body,
    });
  });
});
