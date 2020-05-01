import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { SearchAndSortInteractor } from '@folio/stripes-data-transfer-components/interactors';
import stripesDataTransferTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';
import translations from '../../../../translations/ui-data-export/en';

import { setupApplication } from '../../helpers';

const mappingProfiles = new SearchAndSortInteractor();

describe('Field mapping profiles settings', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-export/mapping-profiles');
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

  describe('clicking on create new mapping profile button', () => {
    beforeEach(async () => {
      await mappingProfiles.header.newButton.click();
    });

    it('should navigate to create mapping profile form', function () {
      expect(this.location.pathname.includes('/data-export/mapping-profiles/create')).to.be.true;
    });
  });
});
