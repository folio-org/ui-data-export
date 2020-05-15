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

const jobProfiles = new SearchAndSortInteractor();

describe('Job profiles settings', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-export/job-profiles');
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
    expect(jobProfiles.searchResults.getCellContent(0, 1)).to.equal('-');
    expect(jobProfiles.searchResults.getCellContent(0, 2)).to.equal('12/4/2018');
    expect(jobProfiles.searchResults.getCellContent(0, 3)).to.equal('Donald S');
  });
});
