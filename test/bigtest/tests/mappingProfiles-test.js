import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { MappingProfilesInteractor } from '@folio/stripes-data-transfer-components/interactors';
import stripesDataTransferTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';
import translations from '../../../translations/ui-data-export/en';

import { setupApplication } from '../helpers';

const mappingProfiles = new MappingProfilesInteractor();

describe('Field mapping profiles settings', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-export/mapping-profiles');
  });

  it('should display mapping profiles pane', () => {
    expect(mappingProfiles.isPresent).to.be.true;
  });

  it('should place headers in correct order', () => {
    expect(mappingProfiles.profilesList.headers(0).text).to.equal(stripesDataTransferTranslations.name);
    expect(mappingProfiles.profilesList.headers(1).text).to.equal(stripesDataTransferTranslations.folioRecordType);
    expect(mappingProfiles.profilesList.headers(2).text).to.equal(translations.format);
    expect(mappingProfiles.profilesList.headers(3).text).to.equal(stripesDataTransferTranslations.updated);
    expect(mappingProfiles.profilesList.headers(4).text).to.equal(stripesDataTransferTranslations.updatedBy);
  });

  it('should display correct fields values', () => {
    expect(mappingProfiles.getCellContent(0, 0)).to.equal('AP Holdings 1');
    expect(mappingProfiles.getCellContent(0, 1)).to.equal(stripesDataTransferTranslations['recordTypes.holdings']);
    expect(mappingProfiles.getCellContent(0, 2)).to.equal('MARC');
    expect(mappingProfiles.getCellContent(0, 3)).to.equal('12/4/2018');
    expect(mappingProfiles.getCellContent(0, 4)).to.equal('Donald S');
  });
});
