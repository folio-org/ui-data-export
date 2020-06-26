import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { JobProfileDetailsInteractor } from '../units/settings/JopProfileDetails/interactors/JobProfileDetailsInteractor';
import { jobProfile } from '../../network/scenarios/fetch-job-profiles-success';
import { setupApplication } from '../../helpers';
import { mappingProfile } from '../../network/scenarios/fetch-mapping-profiles-success';

const jobProfileDetails = new JobProfileDetailsInteractor();

describe('Job profile details', () => {
  setupApplication();

  beforeEach(function () {
    const jobProfileRecord = this.server.create('job-profile', jobProfile);

    this.server.create('mapping-profile', mappingProfile);

    this.server.get('/data-export/mappingProfiles/:id', schema => schema.mappingProfiles.find(jobProfileRecord.mappingProfileId).attrs);

    this.visit(`/settings/data-export/job-profiles/view/${jobProfileRecord.id}`);
  });

  it('should display job profile details', () => {
    expect(jobProfileDetails.isPresent).to.be.true;
  });

  describe('clicking on close button', () => {
    beforeEach(async () => {
      await jobProfileDetails.fullScreen.closeButton.click();
    });

    it('should navigate to mapping profiles settings page', function () {
      expect(this.location.pathname.endsWith('/data-export/job-profiles')).to.be.true;
    });
  });
});
