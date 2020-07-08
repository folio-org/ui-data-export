import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { MappingProfileDetailsInteractor } from '../units/settings/MappingProfileDetails/interactors/MappingProfileDetailsInteractor';
import { setupApplication } from '../../helpers';
import { mappingProfileWithTransformations } from '../../network/scenarios/fetch-mapping-profiles-success';

const mappingProfileDetails = new MappingProfileDetailsInteractor();

describe('Field mapping profile details: default mapping profile', () => {
  setupApplication();

  beforeEach(function () {
    const mappingProfileRecord = this.server.create('mapping-profile', mappingProfileWithTransformations);

    this.server.get('/data-export/mappingProfiles/:id', mappingProfileRecord);

    this.visit(`/settings/data-export/mapping-profiles/view/${mappingProfileRecord}`);
  });

  it('should display mapping profile details', () => {
    expect(mappingProfileDetails.isPresent).to.be.true;
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
