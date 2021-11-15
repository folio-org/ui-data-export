import React from 'react';
import Pretender from 'pretender';
import { noop } from 'lodash';
import { screen, within } from '@testing-library/react';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import userEvent from '@testing-library/user-event';
import { logDOM } from '@testing-library/dom';
import { JobProfileDetailsRoute } from '.';

import { mappingProfile } from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { jobProfile } from '../../../../test/bigtest/network/scenarios/fetch-job-profiles-success';
import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { DEFAULT_JOB_PROFILE_ID } from '../../../utils';

const history = [];

const setupJobProfileDetailsRoute = ({
  matchParams = {},
  location = {
    search: '?location',
  },
} = {}) => {
  renderWithIntl(
    <SettingsComponentBuilder>
      <JobProfileDetailsRoute
        mutator={{ jobProfile: { DELETE: noop } }}
        history={history}
        location={location}
        match={{ params: matchParams }}
      />
    </SettingsComponentBuilder>,
    translationsProperties
  );
};

describe('JobProfileDetails', () => {
  let server;

  beforeEach(() => {
    server = new Pretender();
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('rendering details for a job profile without job profile data', () => {
    it('should display preloader', async () => {
      server.get('/data-export/mapping-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(mappingProfile),
      ]);
      setupJobProfileDetailsRoute();

      const dialog = screen.getByRole('dialog');

      expect(dialog).toBeVisible();
      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });

    it('should history includes location.search', () => {
      server.get('/data-export/mapping-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(mappingProfile),
      ]);
      setupJobProfileDetailsRoute();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      expect(cancelButton).toBeEnabled();

      userEvent.click(cancelButton);

      expect(history.some(el => el.includes('?location'))).toBeTruthy();
    });
  });

  describe('rendering details for a job profile without mapping profile data', () => {
    it('should display preloader', async () => {
      server.get('/data-export/job-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(jobProfile),
      ]);
      setupJobProfileDetailsRoute({ matchParams: { id: DEFAULT_JOB_PROFILE_ID } });

      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });

  describe('rendering details for a job with mapping profile', () => {
    it('should display preloader for default job profile', async () => {
      server.get('/data-export/job-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(jobProfile),
      ]);
      server.get('/data-export/mapping-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(mappingProfile),
      ]);

      setupJobProfileDetailsRoute({ matchParams: { id: DEFAULT_JOB_PROFILE_ID } });

      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });

  describe('rendering details for non default job profile without job execution data', () => {
    const nonDefaultJobProfileId = 'job-profile-id';

    it('should display job profile details for non default job profile', async () => {
      server.get('/data-export/job-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify({
          ...jobProfile,
          id: nonDefaultJobProfileId,
        }),
      ]);
      server.get('/data-export/mapping-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(mappingProfile),
      ]);
      setupJobProfileDetailsRoute({ matchParams: { id: nonDefaultJobProfileId } });

      const summary = await screen.findByRole('region', { name: /summary/i });

      const labelsAndValues = [
        'Record created: 12/4/2018 11:22 AM',
        'Record last updated: 12/4/2018 1:28 PM',
        jobProfile.name,
        jobProfile.description,
        '-',
        mappingProfile.name,
      ];

      labelsAndValues.forEach(el => expect(within(summary).getByText(el)).toBeVisible());
    });
  });

  describe('rendering details for default job profile with job execution data', () => {
    it('should display job profile details', async () => {
      server.get('/data-export/job-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(jobProfile),
      ]);
      server.get('/data-export/mapping-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(mappingProfile),
      ]);

      setupJobProfileDetailsRoute();

      const summary = await screen.findByRole('region', { name: /summary/i });

      const dialog = screen.getByRole('dialog');

      const headings = within(dialog).getAllByRole('heading', { name: jobProfile.name });

      headings.forEach(heading => expect(heading).toBeVisible());

      const labelsAndValues = [
        'Record created: 12/4/2018 11:22 AM',
        'Record last updated: 12/4/2018 1:28 PM',
        jobProfile.name,
        jobProfile.description,
        '-',
        mappingProfile.name,
      ];

      labelsAndValues.forEach(el => expect(within(summary).getByText(el)).toBeVisible());
    });
  });
});
