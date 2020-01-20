import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import { appDisplayInteractor } from '../interactors';

describe('App', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/data-export');
  });

  it('should be visible', () => {
    expect(appDisplayInteractor.isPresent).to.be.true;
  });
});
