import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translation from '../../../translations/ui-data-export/en';
import { setupApplication } from '../helpers';
import { queryFileUploaderInteractor } from '../interactors';

function testUploaderInactiveMode() {
  it('should display title for inactive uploader area', () => {
    expect(queryFileUploaderInteractor.title).to.equal(translation.uploaderTitle);
  });

  it('should display sub title', () => {
    expect(queryFileUploaderInteractor.subTitle).to.equal(translation.uploaderSubTitle);
  });

  it('should display inactive uploader area', () => {
    expect(queryFileUploaderInteractor.hasActiveClass).to.be.false;
  });

  it('should display correct button wording', () => {
    expect(queryFileUploaderInteractor.uploaderBtn.text).to.equal(translation.uploaderBtnText);
  });

  it('should display secondary area when uploader area is inactive', () => {
    expect(queryFileUploaderInteractor.secondaryArea.isVisible).to.be.true;
  });
}

describe('queryFileUploader component', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/data-export');
  });

  testUploaderInactiveMode();

  describe('triggering drag enter on uploader area', () => {
    beforeEach(async () => {
      await queryFileUploaderInteractor.triggerDragEnter();
    });

    it('should display proper title when uploader area is active', () => {
      expect(queryFileUploaderInteractor.title).to.equal(translation.uploaderActiveTitle);
    });

    it('should make file uploader area active', () => {
      expect(queryFileUploaderInteractor.hasActiveClass).to.be.true;
    });

    it('should not display secondary area when uploader area is active', () => {
      expect(queryFileUploaderInteractor.secondaryArea.isVisible).to.be.false;
    });
  });

  describe('triggering drag leave on file uploader area', () => {
    beforeEach(async () => {
      await queryFileUploaderInteractor.triggerDragEnter();
      await queryFileUploaderInteractor.triggerDragLeave();
    });

    testUploaderInactiveMode();
  });
});
