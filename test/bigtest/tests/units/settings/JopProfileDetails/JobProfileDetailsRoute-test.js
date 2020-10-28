import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { cleanup } from '@bigtest/react';
import {
  describe,
  beforeEach,
  it,
  before,
} from '@bigtest/mocha';
import { expect } from 'chai';
import { noop } from 'lodash';

import { Paneset } from '@folio/stripes/components';
import { mountWithContext } from '@folio/stripes-data-transfer-components/interactors';

import { translationsProperties } from '../../../../../helpers';
import { JobProfileDetailsRoute } from '../../../../../../src/settings/JobProfiles/JobProfileDetailsRoute';
import { JobProfileDetailsInteractor } from './interactors/JobProfileDetailsInteractor';
import { mappingProfile } from '../../../../network/scenarios/fetch-mapping-profiles-success';
import { jobProfile } from '../../../../network/scenarios/fetch-job-profiles-success';
import { DEFAULT_JOB_PROFILE_ID } from '../../../../../../src/utils';

async function setupJobProfileDetailsRoute({
  resources,
  matchParams = {},
  history = {},
} = {}) {
  await mountWithContext(
    <Paneset>
      <Router>
        <JobProfileDetailsRoute
          resources={resources}
          mutator={{ jobProfile: { DELETE: noop } }}
          history={history}
          location={{}}
          match={{ params: matchParams }}
        />
      </Router>
    </Paneset>,
    translationsProperties,
  );
}

describe('JobProfileDetails', () => {
  const jobProfileDetails = new JobProfileDetailsInteractor();

  before(async () => {
    await cleanup();
  });

  describe('rendering details for a job profile without job profile data', () => {
    beforeEach(async () => {
      await setupJobProfileDetailsRoute({
        resources: {
          jobProfile: { records: [] },
          mappingProfile: { records: [] },
          jobExecutions: { records: [] },
        },
      });
    });

    it('should display preloader', () => {
      expect(jobProfileDetails.preloader.isSpinnerPresent).to.be.true;
    });
  });

  describe('rendering details for a job profile without mapping profile data', () => {
    beforeEach(async () => {
      await setupJobProfileDetailsRoute({
        resources: {
          jobProfile: { records: [jobProfile] },
          mappingProfile: { records: [] },
          jobExecutions: { records: [] },
        },
        matchParams: { id: DEFAULT_JOB_PROFILE_ID },
      });
    });

    it('should display preloader', () => {
      expect(jobProfileDetails.preloader.isSpinnerPresent).to.be.true;
    });
  });

  describe('rendering details for non default job profile without job execution data', () => {
    beforeEach(async () => {
      const nonDefaultJobProfileId = 'job-profile-id';

      await setupJobProfileDetailsRoute({
        resources: {
          jobProfile: {
            records: [{
              ...jobProfile,
              id: nonDefaultJobProfileId,
            }],
          },
          mappingProfile: { records: [mappingProfile] },
          jobExecutions: { records: [] },
        },
        matchParams: { id: nonDefaultJobProfileId },
      });
    });

    it('should display preloader', () => {
      expect(jobProfileDetails.preloader.isSpinnerPresent).to.be.true;
    });
  });
});
