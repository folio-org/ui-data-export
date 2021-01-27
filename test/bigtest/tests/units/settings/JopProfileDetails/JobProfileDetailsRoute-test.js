import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Pretender from 'pretender';
import { expect } from 'chai';
import { noop } from 'lodash';

import { cleanup } from '@bigtest/react';
import {
  describe,
  beforeEach,
  it,
  before,
} from '@bigtest/mocha';

import { Paneset } from '@folio/stripes/components';
import { mountWithContext } from '@folio/stripes-data-transfer-components/interactors';

import { translationsProperties } from '../../../../../helpers';
import { JobProfileDetailsRoute } from '../../../../../../src/settings/JobProfiles/JobProfileDetailsRoute';
import { JobProfileDetailsInteractor } from './interactors/JobProfileDetailsInteractor';
import { mappingProfile } from '../../../../network/scenarios/fetch-mapping-profiles-success';
import { jobProfile } from '../../../../network/scenarios/fetch-job-profiles-success';
import { DEFAULT_JOB_PROFILE_ID } from '../../../../../../src/utils';

const setupJobProfileDetailsRoute = async function ({
  matchParams = {},
  history = {},
} = {}) {
  await mountWithContext(
    <Router>
      <Paneset>
        <JobProfileDetailsRoute
          mutator={{ jobProfile: { DELETE: noop } }}
          history={history}
          location={{}}
          match={{ params: matchParams }}
        />
      </Paneset>
    </Router>,
    translationsProperties
  );
};

describe('JobProfileDetails', () => {
  const jobProfileDetails = new JobProfileDetailsInteractor();
  let server;

  before(async () => {
    await cleanup();
  });

  beforeEach(() => {
    server = new Pretender();

    server.get('/data-export/job-profiles/:id', () => [
      200,
      { 'content-type': 'application/json' },
      'null',
    ]);
    server.get('/data-export/mapping-profiles/:id', () => [
      200,
      { 'content-type': 'application/json' },
      'null',
    ]);
    server.get('/data-export/job-executions', () => [
      200,
      { 'content-type': 'application/json' },
      'null',
    ]);
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('rendering details for a job profile without job profile data', () => {
    beforeEach(async () => {
      await setupJobProfileDetailsRoute();
    });

    it('should display preloader', () => {
      expect(jobProfileDetails.preloader.spinner.isPresent).to.be.true;
    });
  });

  describe('rendering details for a job profile without mapping profile data', () => {
    beforeEach(async () => {
      server.get('/data-export/job-profiles/:id', () => [
        200,
        { 'content-type': 'application/json' },
        JSON.stringify(jobProfile),
      ]);

      await setupJobProfileDetailsRoute({ matchParams: { id: DEFAULT_JOB_PROFILE_ID } });
    });

    it('should display preloader', () => {
      expect(jobProfileDetails.preloader.spinner.isPresent).to.be.true;
    });
  });

  describe('rendering details for non default job profile without job execution data', () => {
    beforeEach(async () => {
      const nonDefaultJobProfileId = 'job-profile-id';

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
    });

    it('should display preloader', () => {
      expect(jobProfileDetails.preloader.spinner.isPresent).to.be.true;
    });
  });
});
