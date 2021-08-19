import React from 'react';
import Pretender from 'pretender';
import { noop } from 'lodash';
import { screen } from '@testing-library/react';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import userEvent from '@testing-library/user-event';
import { JobProfileDetailsRoute } from '.';

import { mappingProfile } from '../../../../test/bigtest/network/scenarios/fetch-mapping-profiles-success';
import { jobProfile } from '../../../../test/bigtest/network/scenarios/fetch-job-profiles-success';
import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { DEFAULT_JOB_PROFILE_ID } from '../../../utils';

const setupJobProfileDetailsRoute = ({
  matchParams = {},
  history = [],
  location = {
    search: 'location',
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
      await setupJobProfileDetailsRoute();

      const dialog = screen.getByRole('dialog');
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      expect(dialog).toBeVisible();
      expect(cancelButton).toBeEnabled();

      userEvent.click(cancelButton);

      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });

  describe('rendering details for a job profile without mapping profile data', () => {
    it('should display preloader', async () => {
      server.get('/data-export/job-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(jobProfile),
      ]);
      await setupJobProfileDetailsRoute({ matchParams: { id: DEFAULT_JOB_PROFILE_ID } });

      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });

  describe('rendering details for a job with mapping profile', () => {
    it('should display preloader', async () => {
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

      await setupJobProfileDetailsRoute({ matchParams: { id: DEFAULT_JOB_PROFILE_ID } });

      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });

  describe('rendering details for non default job profile without job execution data', () => {
    const nonDefaultJobProfileId = 'job-profile-id';

    it('should display preloader', async () => {
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
      await setupJobProfileDetailsRoute({ matchParams: { id: nonDefaultJobProfileId } });

      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });

  describe('rendering details for non default job profile with job execution data', () => {
    it('should display preloader', async () => {
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

      await setupJobProfileDetailsRoute();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      userEvent.click(cancelButton);
      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });
});
