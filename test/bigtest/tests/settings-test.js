import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import {
  settingsDisplayInteractor,
  SettingsSectionsPaneInteractor,
} from '../interactors';
import translations from '../../../translations/ui-data-export/en';

const settingsSectionsPane = new SettingsSectionsPaneInteractor();

describe('Settings', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-export');
  });

  it('should be visible', () => {
    expect(settingsDisplayInteractor.isPresent).to.be.true;
    expect(settingsDisplayInteractor.text).to.equal('Data export');
  });

  it('should display profiles label', () => {
    expect(settingsSectionsPane.profilesLabel.isPresent).to.be.true;
  });

  it('should display section labels', () => {
    expect(settingsSectionsPane.sectionsLabels(0).isPresent).to.be.true;
  });

  it('should display field mapping profile section', () => {
    expect(settingsSectionsPane.sectionsLabels(0).text).to.equal(translations.mappingProfilesTitle);
  });

  describe('clicking on field mapping profile navigation item', () => {
    beforeEach(async () => {
      await settingsSectionsPane.navigationItems(0).click();
    });

    it('should navigate to field mapping profile section', function () {
      expect(this.location.pathname.endsWith('mapping-profiles')).to.be.true;
    });
  });
});
