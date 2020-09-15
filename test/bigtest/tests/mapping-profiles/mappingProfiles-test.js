import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import {
  SearchAndSortInteractor,
  wait,
} from '@folio/stripes-data-transfer-components/interactors';
import stripesDataTransferTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import translations from '../../../../translations/ui-data-export/en';
import { MappingProfilesFormInteractor } from '../units/settings/MappingProfilesForm/interactors/MappingProfilesFormInteractor';
import { setupApplication } from '../../helpers';

const mappingProfiles = new SearchAndSortInteractor();

describe('Field mapping profiles settings', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success'] });

  beforeEach(function () {
    this.visit('/settings/data-export/mapping-profiles?sort=name');
  });

  it('should display mapping profiles pane', () => {
    expect(mappingProfiles.isPresent).to.be.true;
  });

  it('should place headers in correct order', () => {
    expect(mappingProfiles.searchResults.list.headers(0).text).to.equal(stripesDataTransferTranslations.name);
    expect(mappingProfiles.searchResults.list.headers(1).text).to.equal(stripesDataTransferTranslations.folioRecordType);
    expect(mappingProfiles.searchResults.list.headers(2).text).to.equal(translations.format);
    expect(mappingProfiles.searchResults.list.headers(3).text).to.equal(stripesDataTransferTranslations.updated);
    expect(mappingProfiles.searchResults.list.headers(4).text).to.equal(stripesDataTransferTranslations.updatedBy);
  });

  it('should display correct fields values', () => {
    expect(mappingProfiles.searchResults.getCellContent(0, 0)).to.equal('AP Holdings 1');
    expect(mappingProfiles.searchResults.getCellContent(0, 1)).to.equal(stripesDataTransferTranslations['recordTypes.holdings']);
    expect(mappingProfiles.searchResults.getCellContent(0, 2)).to.equal('MARC');
    expect(mappingProfiles.searchResults.getCellContent(0, 3)).to.equal('12/4/2018');
    expect(mappingProfiles.searchResults.getCellContent(0, 4)).to.equal('Donald S');
  });

  it('should not display values if they are not present in mapping profile', () => {
    expect(mappingProfiles.searchResults.getCellContent(1, 4)).to.equal('');
  });

  describe('clicking on create new mapping profile button', () => {
    const form = new MappingProfilesFormInteractor();
    const callout = new CalloutInteractor();

    beforeEach(async () => {
      await mappingProfiles.header.newButton.click();
    });

    it('should navigate to create mapping profile form', function () {
      expect(this.location.pathname.includes('/data-export/mapping-profiles/create')).to.be.true;
    });

    it('should save query in path after navigation', function () {
      expect(this.location.search.includes('?sort=name')).to.be.true;
    });

    describe('filling form by correct data and pressing save button - success case', () => {
      beforeEach(async () => {
        await form.summary.name.fillAndBlur('mapping profile');
        await form.summary.recordType.checkboxes(1).clickInput();
        await form.summary.description.fillAndBlur('description');
        await form.addTransformationsButton.click();
        await wait();
        await form.transformationsModal.transformations.valuesFields(0).fillAndBlur('Custom value');
        await form.transformationsModal.transformations.checkboxes(0).clickInput();
        await form.transformationsModal.saveButton.click();
        await wait();
        await form.fullScreen.submitButton.click();
      });

      it('should navigate to mapping profiles list', function () {
        expect(this.location.pathname.endsWith('/data-export/mapping-profiles')).to.be.true;
        expect(this.location.search.includes('?sort=name')).to.be.true;
      });

      it('should display success callout', () => {
        expect(callout.successCalloutIsPresent).to.be.true;
      });
    });

    describe('filling form by correct data and pressing save button - error case', () => {
      beforeEach(async function () {
        this.server.post('/data-export/mapping-profiles', {}, 500);
        await form.summary.name.fillAndBlur('mapping profile');
        await form.summary.recordType.checkboxes(1).clickInput();
        await form.summary.description.fillAndBlur('description');
        await form.addTransformationsButton.click();
        await wait();
        await form.transformationsModal.transformations.valuesFields(0).fillAndBlur('Custom value');
        await form.transformationsModal.transformations.checkboxes(0).clickInput();
        await form.transformationsModal.saveButton.click();
        await wait();
        await form.fullScreen.submitButton.click();
      });

      it('should not navigate to mapping profiles list', function () {
        expect(this.location.pathname.endsWith('/data-export/mapping-profiles/create')).to.be.true;
        expect(this.location.search.includes('?sort=name')).to.be.true;
      });

      it('should display error callout', () => {
        expect(callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });

  describe('clicking on mapping profiles list item', () => {
    beforeEach(async () => {
      await mappingProfiles.searchResults.list.rows(0).click();
    });

    it('should navigate to create mapping profile details', function () {
      expect(this.location.pathname.includes('/data-export/mapping-profiles/view')).to.be.true;
    });

    it('should save query in path after navigation', function () {
      expect(this.location.search.includes('?sort=name')).to.be.true;
    });
  });
});
