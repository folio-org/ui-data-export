import React from 'react';
import Pretender from 'pretender';
import { noop } from 'lodash';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { screen, within } from '@testing-library/react';
import { EditJobProfileRoute } from '.';

import { jobProfile } from '../../../../test/bigtest/network/scenarios/fetch-job-profiles-success';
import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { checkJobProfileFormState } from '../test/setup';

const history = [];
const JOB_PROFILE_ID = '6f7f3cd7-9f24-42eb-ae91-91af1cd54d0a';

const setupEditJobProfileRoute = ({
  matchParams = {},
  location = {
    search: '?location',
  },
} = {}) => {
  renderWithIntl(
    <SettingsComponentBuilder>
      <EditJobProfileRoute
        mutator={{ jobProfile: { PUT: noop } }}
        history={history}
        resources={{
          mappingProfiles: {
            hasLoaded: true,
            records: [],
          },
        }}
        location={location}
        match={{ params: matchParams }}
        onSubmit={noop}
        onCancel={noop}
      />
    </SettingsComponentBuilder>,
    translationsProperties
  );
};

describe('EditJobProfile', () => {
  let server;

  beforeEach(() => {
    server = new Pretender();
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('rendering details for a job profile without mapping profile data', () => {
    it('should display preloader', async () => {
      server.get('/data-export/job-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(jobProfile),
      ]);

      setupEditJobProfileRoute({ matchParams: { id: JOB_PROFILE_ID } });

      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });

    it('should display correct form state', async () => {
      server.get('/data-export/job-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(jobProfile),
      ]);

      setupEditJobProfileRoute({ matchParams: { id: JOB_PROFILE_ID } });

      const form = await screen.findByTestId('full-screen-form');

      await checkJobProfileFormState(form, {
        title: /Edit A Lorem impsum 1/i,
        isTCPIPEnabled: false,
      });
    });
  });
});
