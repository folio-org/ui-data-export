import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { MappingProfilesFormInteractor } from '../units/settings/MappingProfilesForm/interactors/MappingProfilesFormInteractor';
import { setupApplication } from '../../helpers';

const form = new MappingProfilesFormInteractor();

describe('Field mapping profiles form', () => {
  setupApplication();

  beforeEach(function () {
    this.server.get('/data-export/transformation-fields', { transformationFields: [] });
    this.visit('/settings/data-export/mapping-profiles/create');
  });

  it('should display mapping profiles form', () => {
    expect(form.isPresent).to.be.true;
  });

  describe('clicking cancel button', () => {
    beforeEach(async () => {
      await form.fullScreen.cancelButton.click();
    });

    it('should navigate mapping profiles settings page', function () {
      expect(this.location.pathname.endsWith('/data-export/mapping-profiles')).to.be.true;
    });
  });

  describe('clicking on close button', () => {
    beforeEach(async () => {
      await form.fullScreen.closeButton.click();
    });

    it('should navigate mapping profiles settings page', function () {
      expect(this.location.pathname.endsWith('/data-export/mapping-profiles')).to.be.true;
    });
  });
});
