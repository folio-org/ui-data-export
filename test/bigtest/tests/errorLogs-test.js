import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { OverlayViewInteractor } from '@folio/stripes-data-transfer-components/interactors';
import { setupApplication } from '../helpers';

describe('Error logs', () => {
  const overlayViewInteractor = new OverlayViewInteractor();

  setupApplication([]);

  describe('visiting error logs page', () => {
    beforeEach(function () {
      this.visit('/data-export/log/log-id');
    });

    it('should display overlay view', () => {
      expect(overlayViewInteractor.isPresent).to.be.true;
    });
  });
});
