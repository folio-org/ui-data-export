import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import { mappingProfilesInteractor } from '../interactors';
import translations from '../../../translations/ui-data-export/en';

describe('Field mapping profiles settings', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-export/mapping-profiles');
  });

  it('should be visible', () => {
    expect(mappingProfilesInteractor.isPresent).to.be.true;
  });

  it('should display field mapping profiles section', () => {
    expect(mappingProfilesInteractor.paneTitle.text).to.equal(translations.mappingProfilesTitle);
  });

  it('should contain search form', () => {
    expect(mappingProfilesInteractor.searchForm.isPresent).to.be.true;
  });
});
