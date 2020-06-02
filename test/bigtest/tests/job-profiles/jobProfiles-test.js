import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import { SearchAndSortInteractor } from '@folio/stripes-data-transfer-components/interactors';
import stripesDataTransferTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import { JobProfilesFormInteractor } from '../units/settings/JobProfilesForm/interactor';
import translations from '../../../../translations/ui-data-export/en';
import { setupApplication } from '../../helpers';

const jobProfiles = new SearchAndSortInteractor();

describe('Job profiles settings', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success', 'fetch-job-profiles-success'] });

  beforeEach(function () {
    this.visit('/settings/data-export/job-profiles?sort=name');
  });

  it('should display job profiles pane', () => {
    expect(jobProfiles.isPresent).to.be.true;
  });

  it('should place headers in correct order', () => {
    expect(jobProfiles.searchResults.list.headers(0).text).to.equal(stripesDataTransferTranslations.name);
    expect(jobProfiles.searchResults.list.headers(1).text).to.equal(translations.protocol);
    expect(jobProfiles.searchResults.list.headers(2).text).to.equal(stripesDataTransferTranslations.updated);
    expect(jobProfiles.searchResults.list.headers(3).text).to.equal(stripesDataTransferTranslations.updatedBy);
  });

  it('should display correct fields values', () => {
    expect(jobProfiles.searchResults.getCellContent(0, 0)).to.equal('A Lorem impsum 1');
    expect(jobProfiles.searchResults.getCellContent(0, 1)).to.equal('');
    expect(jobProfiles.searchResults.getCellContent(0, 2)).to.equal('12/4/2018');
    expect(jobProfiles.searchResults.getCellContent(0, 3)).to.equal('Donald S');
  });

  describe('clicking on create new job profile button', () => {
    const form = new JobProfilesFormInteractor();
    const callout = new CalloutInteractor();

    beforeEach(async () => {
      await jobProfiles.header.newButton.click();
    });

    it('should navigate to create job profile form saving query in path', function () {
      expect(this.location.pathname.includes('/data-export/job-profiles/create')).to.be.true;
    });

    it('should save query in path after navigation', function () {
      expect(this.location.search.includes('?sort=name')).to.be.true;
    });

    describe('filling form by correct data and pressing save button - success case', () => {
      beforeEach(async () => {
        await form.name.fillAndBlur('mapping profile');
        await form.mappingProfile.selectOption('AP Holdings 1');
        await form.fullScreen.submitButton.click();
      });

      it('should navigate to job profiles list', function () {
        expect(this.location.pathname.endsWith('/data-export/job-profiles')).to.be.true;
        expect(this.location.search.includes('?sort=name')).to.be.true;
      });

      it('should display success callout', function () {
        expect(callout.successCalloutIsPresent).to.be.true;
      });
    });

    describe('filling form by correct data and pressing save button - error case', () => {
      beforeEach(async function () {
        this.server.post('/data-export/jobProfiles', {}, 500);
        await form.name.fillAndBlur('mapping profile');
        await form.mappingProfile.selectOption('AP Holdings 1');
        await form.fullScreen.submitButton.click();
      });

      it('should not navigate to job profiles list', function () {
        expect(this.location.pathname.endsWith('/data-export/job-profiles/create')).to.be.true;
        expect(this.location.search.includes('?sort=name')).to.be.true;
      });

      it('should display error callout', function () {
        expect(callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
