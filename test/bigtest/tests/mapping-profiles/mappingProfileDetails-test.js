import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import { wait } from '@folio/stripes-data-transfer-components/interactors';

import { MappingProfileDetailsInteractor } from '../units/settings/MappingProfileDetails/interactors/MappingProfileDetailsInteractor';
import { setupApplication } from '../../helpers';
import { mappingProfile } from '../../network/scenarios/fetch-mapping-profiles-success';
import { jobProfile } from '../../network/scenarios/fetch-job-profiles-success';

const mappingProfileDetails = new MappingProfileDetailsInteractor();

describe('Field mapping profile details', () => {
  setupApplication();

  beforeEach(function () {
    this.server.get('/data-export/mappingProfiles/:id', mappingProfile);
    this.server.get('/data-export/jobProfiles?query=mappingProfileId==custom_id&limit=1', {
      ...jobProfile,
      ...{ mappingProfileId: mappingProfile.id },
    });

    this.visit(`/settings/data-export/mapping-profiles/view/${mappingProfile.id}`);
  });

  it('should display mapping profile details', () => {
    expect(mappingProfileDetails.isPresent).to.be.true;
  });

  describe('navigating to deleting confirmation modal', () => {
    const callout = new CalloutInteractor();

    beforeEach(async () => {
      await mappingProfileDetails.actionMenu.click();
      await mappingProfileDetails.actionMenu.deleteProfileButton.click();
      await wait();
    });

    describe('deleting mapping profile successfully', () => {
      beforeEach(async () => {
        await mappingProfileDetails.deletingConfirmationModal.confirmButton.click();
      });

      it('should navigate to mapping profiles settings page', function () {
        expect(this.location.pathname.endsWith('/data-export/mapping-profiles')).to.be.true;
      });

      it('should display success callout', function () {
        expect(callout.successCalloutIsPresent).to.be.true;
      });
    });

    describe('deleting mapping profile with errors', () => {
      beforeEach(async function () {
        this.server.delete('/data-export/mappingProfiles/:id', {}, 500);

        await mappingProfileDetails.deletingConfirmationModal.confirmButton.click();
      });

      it('should navigate to job profiles settings page', function () {
        expect(this.location.pathname.endsWith('/data-export/mapping-profiles')).to.be.true;
      });

      it('should display error callout', function () {
        expect(callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });

  describe('clicking on close button', () => {
    beforeEach(async () => {
      await mappingProfileDetails.fullScreen.closeButton.click();
    });

    it('should navigate to mapping profiles settings page', function () {
      expect(this.location.pathname.endsWith('/data-export/mapping-profiles')).to.be.true;
    });
  });
});
