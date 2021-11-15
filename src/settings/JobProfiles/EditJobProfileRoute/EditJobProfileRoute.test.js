import React from 'react';
import Pretender from 'pretender';
import { noop } from 'lodash';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { EditJobProfileRoute } from '.';

import { jobProfile } from '../../../../test/bigtest/network/scenarios/fetch-job-profiles-success';
import { translationsProperties } from '../../../../test/helpers';
import { SettingsComponentBuilder } from '../../../../test/jest/helpers';
import { DEFAULT_JOB_PROFILE_ID } from '../../../utils';

const history = [];

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

      setupEditJobProfileRoute({ matchParams: { id: DEFAULT_JOB_PROFILE_ID } });

      expect(document.querySelector('[data-test-preloader]')).toBeVisible();
    });
  });
});
