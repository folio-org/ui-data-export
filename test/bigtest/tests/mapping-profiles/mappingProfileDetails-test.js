import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { MappingProfileDetailsInteractor } from '../units/settings/MappingProfileDetails/interactors/MappingProfileDetailsInteractor';
import { setupApplication } from '../../helpers';

const mappingProfileDetails = new MappingProfileDetailsInteractor();

describe('Field mapping profile details', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-export/mapping-profiles/view/25d81cbe-9686-11ea-bb37-0242ac130002');
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
