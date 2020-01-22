import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import { settingsDisplayInteractor } from '../interactors';

describe('Settings', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-export');
  });

  it('should be visible', () => {
    expect(settingsDisplayInteractor.isPresent).to.be.true;
    expect(settingsDisplayInteractor.text).to.equal('Data export');
  });
});
