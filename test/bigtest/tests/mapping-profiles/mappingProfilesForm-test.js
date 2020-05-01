import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { FullScreenFormInteractor } from '@folio/stripes-data-transfer-components/interactors';

import { setupApplication } from '../../helpers';
import translations from '../../../../translations/ui-data-export/en';

const fullScreenForm = new FullScreenFormInteractor();

describe('Field mapping profiles form', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-export/mapping-profiles/create');
  });

  it('should display mapping profiles form', () => {
    expect(fullScreenForm.isPresent).to.be.true;
  });

  it('should display correct pane title', () => {
    expect(fullScreenForm.header.text).to.equal(translations['mappingProfiles.newProfile']);
  });

  describe('clicking cancel button', () => {
    beforeEach(async () => {
      await fullScreenForm.cancelButton.click();
    });

    it('should navigate mapping profiles settings page', function () {
      expect(this.location.pathname.endsWith('/data-export/mapping-profiles')).to.be.true;
    });
  });

  describe('clicking on close button', () => {
    beforeEach(async () => {
      await fullScreenForm.closeButton.click();
    });

    it('should navigate mapping profiles settings page', function () {
      expect(this.location.pathname.endsWith('/data-export/mapping-profiles')).to.be.true;
    });
  });
});
