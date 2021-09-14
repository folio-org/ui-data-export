import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translation from '../../../translations/ui-data-export/en';
import { setupApplication } from '../helpers';
import { queryFileUploaderInteractor } from '../interactors';

function initiateFileUpload(files = []) {
  return queryFileUploaderInteractor.triggerDrop({
    dataTransfer: {
      types: ['Files'],
      files,
    },
  });
}

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

  describe('triggering drop on uploader area with no files', () => {
    beforeEach(async () => {
      await initiateFileUpload();
    });

    it.always('should not initiate uploading process', () => {
      expect(queryFileUploaderInteractor.hasPreloader).to.be.false;
    });
  });

  describe('triggering drop on uploader area with file in case of success API responses', () => {
    beforeEach(async () => {
      await initiateFileUpload([new File([], 'file.csv')]);
    });

    it('should show preloader indicator', () => {
      expect(queryFileUploaderInteractor.hasPreloader).to.be.true;
    });

    it.always('should not show error notification', () => {
      expect(queryFileUploaderInteractor.callout.errorCalloutIsPresent).to.be.false;
    });

    it('should redirect to choose job profile page', function () {
      expect(this.location.pathname.includes('/data-export/job-profile')).to.be.true;
    });
  });

  describe('triggering drop on uploader area with file in case of error API response', () => {
    beforeEach(async function () {
      this.server.post('/data-export/file-definitions', {}, 500);

      await initiateFileUpload([new File([], 'file.csv')]);
    });

    it('should show error notification', () => {
      expect(queryFileUploaderInteractor.callout.errorCalloutIsPresent).to.be.true;
    });
  });

  describe('error modal showing with invalid type file', () => {
    beforeEach(async () => {
      await initiateFileUpload([new File([], 'file.pdf')]);
    });

    it('should render error modal', () => {
      expect(queryFileUploaderInteractor.fileExtensionModal.isPresent).to.be.true;
    });

    it('should display correct header', () => {
      expect(queryFileUploaderInteractor.fileExtensionModal.header.text).to.equal(translation['modal.fileExtensions.blocked.header']);
    });

    describe('cancel button clicked', () => {
      beforeEach(async () => {
        await queryFileUploaderInteractor.fileExtensionModal.cancelButton.click();
      });

      it('should close modal', () => {
        expect(queryFileUploaderInteractor.fileExtensionModal.isPresent).to.be.false;
      });
    });

    describe('action (confirm) button clicked', () => {
      beforeEach(async () => {
        await queryFileUploaderInteractor.fileExtensionModal.confirmButton.click();
      });

      it('should close modal', () => {
        expect(queryFileUploaderInteractor.fileExtensionModal.isPresent).to.be.false;
      });
    });
  });

  describe('error modal not showing with csv type file', () => {
    beforeEach(async () => {
      await initiateFileUpload([new File([], 'file.csv')]);
    });

    it('should not render error modal', () => {
      expect(queryFileUploaderInteractor.fileExtensionModal.isPresent).to.be.false;
    });
  });

  describe('error modal not showing with cql type file', () => {
    beforeEach(async () => {
      await initiateFileUpload([new File([], 'file.cql')]);
    });

    it('should not render error modal', () => {
      expect(queryFileUploaderInteractor.fileExtensionModal.isPresent).to.be.false;
    });
  });
});
