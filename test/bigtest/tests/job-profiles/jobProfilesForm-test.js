import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { JobProfilesFormInteractor } from '../units/settings/JobProfilesForm/interactor';
import { setupApplication } from '../../helpers';

const form = new JobProfilesFormInteractor();

describe('Job profiles form', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success'] });

  beforeEach(function () {
    this.visit('/settings/data-export/job-profiles/create');
  });

  it('should display job profiles form', () => {
    expect(form.isPresent).to.be.true;
  });

  describe('clicking cancel button', () => {
    beforeEach(async () => {
      await form.fullScreen.cancelButton.click();
    });

    it('should navigate job profiles settings page', function () {
      expect(this.location.pathname.endsWith('/data-export/job-profiles')).to.be.true;
    });
  });

  describe('clicking on close button', () => {
    beforeEach(async () => {
      await form.fullScreen.closeButton.click();
    });

    it('should navigate job profiles settings page', function () {
      expect(this.location.pathname.endsWith('/data-export/job-profiles')).to.be.true;
    });
  });
});
