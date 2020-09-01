import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import { wait } from '@folio/stripes-data-transfer-components/interactors';

import { JobProfileDetailsInteractor } from '../units/settings/JopProfileDetails/interactors/JobProfileDetailsInteractor';
import { jobProfile } from '../../network/scenarios/fetch-job-profiles-success';
import { setupApplication } from '../../helpers';
import { mappingProfile } from '../../network/scenarios/fetch-mapping-profiles-success';

const jobProfileDetails = new JobProfileDetailsInteractor();

describe('Job profile details', () => {
  setupApplication();

  beforeEach(function () {
    const jobProfileRecord = this.server.create('job-profile', {
      ...jobProfile,
      ...{ id: 'custom_id' },
    });

    this.server.get('/data-export/mapping-profiles/:id', mappingProfile);

    this.visit(`/settings/data-export/job-profiles/view/${jobProfileRecord.id}`);
  });

  it('should display job profile details', () => {
    expect(jobProfileDetails.isPresent).to.be.true;
  });

  describe('navigating to deleting confirmation modal', () => {
    const callout = new CalloutInteractor();

    beforeEach(async () => {
      await jobProfileDetails.actionMenu.click();
      await jobProfileDetails.actionMenu.deleteProfileButton.click();
      await wait();
    });

    describe('deleting job profile successfully', () => {
      beforeEach(async () => {
        await jobProfileDetails.deletingConfirmationModal.confirmButton.click();
      });

      it('should navigate to job profiles settings page', function () {
        expect(this.location.pathname.endsWith('/data-export/job-profiles')).to.be.true;
      });

      it('should display success callout', () => {
        expect(callout.successCalloutIsPresent).to.be.true;
      });
    });

    describe('deleting job profile with errors', () => {
      beforeEach(async function () {
        this.server.delete('/data-export/job-profiles/:id', {}, 500);

        await jobProfileDetails.deletingConfirmationModal.confirmButton.click();
      });

      it('should navigate to job profiles settings page', function () {
        expect(this.location.pathname.endsWith('/data-export/job-profiles')).to.be.true;
      });

      it('should display error callout', () => {
        expect(callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });

  describe('clicking on close button', () => {
    beforeEach(async () => {
      await jobProfileDetails.fullScreen.closeButton.click();
    });

    it('should navigate to job profiles settings page', function () {
      expect(this.location.pathname.endsWith('/data-export/job-profiles')).to.be.true;
    });
  });
});
