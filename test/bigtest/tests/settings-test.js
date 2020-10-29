import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
  afterEach,
} from '@bigtest/mocha';

import { wait } from '@folio/stripes-data-transfer-components/interactors';

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
    expect(settingsDisplayInteractor.text).to.equal(translations['settings.index.paneTitle']);
  });

  it('should display profiles label', () => {
    expect(settingsSectionsPane.profilesLabel.isPresent).to.be.true;
  });

  it('should not display profiles inform popover', () => {
    expect(settingsSectionsPane.profilesPopover.content.isPresent).to.be.false;
  });

  it('should display section labels', () => {
    expect(settingsSectionsPane.sectionsLabels(0).isPresent).to.be.true;
  });

  it('should display field mapping profiles section', () => {
    expect(settingsSectionsPane.sectionsLabels(1).text).to.equal(translations.mappingProfilesTitle);
  });

  it('should display job profiles section', () => {
    expect(settingsSectionsPane.sectionsLabels(0).text).to.equal(translations.jobProfilesTitle);
  });

  describe('clicking on field mapping profiles navigation item', () => {
    beforeEach(async () => {
      await settingsSectionsPane.navigationItems(1).click();
    });

    it('should navigate to field mapping profiles section', function () {
      expect(this.location.pathname.endsWith('mapping-profiles')).to.be.true;
    });
  });

  describe('clicking on job profiles navigation item', () => {
    beforeEach(async () => {
      await settingsSectionsPane.navigationItems(0).click();
    });

    it('should navigate to job profiles section', function () {
      expect(this.location.pathname.endsWith('job-profiles')).to.be.true;
    });
  });

  describe('clicking on inform button from profiles label', () => {
    beforeEach(async () => {
      await settingsSectionsPane.profilesLabel.infoButton.click();
    });

    afterEach(async () => {
      await settingsSectionsPane.profilesLabel.infoButton.click();
      await wait();
    });

    it('should not display profiles inform popover with correct message', () => {
      expect(settingsSectionsPane.profilesPopover.content.text).to.equal(translations['settings.profilesInfo']);
    });

    it('should have correct link in learn more button', () => {
      expect(settingsSectionsPane.profilesPopover.linkHref).to.equal('https://wiki.folio.org/x/AyUuAg');
    });
  });
});
