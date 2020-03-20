import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';
import translations from '../../../translations/ui-data-export/en';
import { setupApplication } from '../helpers';
import { jobLogsContainerInteractor } from '../interactors';
import {
  testUserOzzy,
  testUserElliot,
} from '../network/scenarios/fetch-job-profiles-success';

const getCellContent = (row, cell) => jobLogsContainerInteractor.logsList.rows(row).cells(cell).content;

describe('Job logs list', () => {
  describe('default scenario', () => {
    setupApplication({ scenarios: ['fetch-job-profiles-success'] });

    beforeEach(function () {
      this.visit('/data-export');
    });

    it('should display logs list', () => {
      expect(jobLogsContainerInteractor.logsList.isPresent).to.be.true;
    });

    it('should add status column to the end', () => {
      expect(jobLogsContainerInteractor.logsList.headers(5).text).to.equal(translations.status);
    });

    it('should be sorted by "completedDate" descending by default', () => {
      expect(getCellContent(0, 5)).to.equal('Fail');
      expect(getCellContent(1, 5)).to.equal('Success');
    });

    it('should render ID column', () => {
      expect(jobLogsContainerInteractor.logsList.headers(1).text).to.equal(commonTranslations.jobExecutionHrId);
    });

    it('should render Run by column', () => {
      expect(jobLogsContainerInteractor.logsList.headers(4).text).to.equal(commonTranslations.runBy);
    });

    describe('clicking on status header', () => {
      beforeEach(async () => {
        await jobLogsContainerInteractor.logsList.headers(5).click();
      });

      it('should sort by status in ascending order', () => {
        expect(getCellContent(1, 5)).to.equal('Success');
      });

      it('should have the correct query in path', function () {
        expect(this.location.search.includes('direction=ascending&sort=status')).to.be.true;
      });

      describe('clicking on status header', () => {
        beforeEach(async () => {
          await jobLogsContainerInteractor.logsList.headers(5).click();
        });

        it('should sort by status in descending order', () => {
          expect(getCellContent(1, 5)).to.equal('Fail');
          expect(getCellContent(0, 5)).to.equal('Success');
        });

        it('should have the correct query in path', function () {
          expect(this.location.search.includes('direction=descending&sort=status')).to.be.true;
        });
      });
    });

    describe('clicking on file name with success flow', () => {
      beforeEach(async function () {
        await jobLogsContainerInteractor.fileNameBtns(0).click();
      });

      it('should not show error notification', () => {
        expect(jobLogsContainerInteractor.callout.errorCalloutIsPresent).to.be.false;
      });
    });

    describe('clicking on ID header', () => {
      beforeEach(async () => {
        await jobLogsContainerInteractor.logsList.headers(1).click();
      });

      it('should sort by number from ID field', () => {
        expect(getCellContent(0, 1)).to.equal('2');
        expect(getCellContent(1, 1)).to.equal('4');
      });

      it('should have the correct query in path', function () {
        expect(this.location.search.includes('direction=ascending&sort=hrId')).to.be.true;
      });
    });

    describe('clicking on Run by header', () => {
      beforeEach(async () => {
        await jobLogsContainerInteractor.logsList.headers(4).click();
      });

      it('should sort by User name from Run by field', () => {
        const userOzzy = `${testUserOzzy.firstName} ${testUserOzzy.lastName}`;
        const userElliot = `${testUserElliot.firstName} ${testUserElliot.lastName}`;

        expect(getCellContent(0, 4)).to.equal(userElliot);
        expect(getCellContent(1, 4)).to.equal(userOzzy);
      });

      it('should have the correct query in path', function () {
        expect(this.location.search.includes('direction=ascending&sort=runBy')).to.be.true;
      });
    });
  });

  describe('error scenario', () => {
    setupApplication({ scenarios: ['fetch-job-profiles-success', 'fetch-get-download-link-error'] });

    beforeEach(async function () {
      this.visit('/data-export');
      await jobLogsContainerInteractor.fileNameBtns(0).click();
    });

    it('should show error notification', () => {
      expect(jobLogsContainerInteractor.callout.errorCalloutIsPresent).to.be.true;
    });
  });
});
