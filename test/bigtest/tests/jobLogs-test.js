import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';
import translations from '../../../translations/ui-data-export/en';
import {
  getColumnIndexMapping,
  setupApplication,
} from '../helpers';
import {
  jobLogsContainerInteractor,
  allLogsPaneInteractor,
} from '../interactors';
import { logJobExecutions } from '../network/scenarios/fetch-job-executions-success';
import { DEFAULT_JOB_LOG_COLUMNS } from '../../../src/utils';
import { errorLogsInteractor } from './units/ErrorLogs/interactor';

const getUser = row => logJobExecutions[row].runBy;
const getCellContent = (row, cell) => jobLogsContainerInteractor.logsList.rows(row).cells(cell).content;
const columnIndexMapping = getColumnIndexMapping(DEFAULT_JOB_LOG_COLUMNS);

describe('Job logs list', () => {
  describe('default scenario', () => {
    setupApplication({ scenarios: ['fetch-job-executions-success'] });

    beforeEach(function () {
      this.visit('/data-export');
    });

    it('should display logs list', () => {
      expect(jobLogsContainerInteractor.logsList.isPresent).to.be.true;
    });

    it('should add status column', () => {
      expect(jobLogsContainerInteractor.logsList.headers(columnIndexMapping.status).text).to.equal(translations.status);
    });

    it('should display view all logs button', () => {
      expect(jobLogsContainerInteractor.viewAllLogsButton.isPresent).to.be.true;
    });

    it('should display correct text on view all logs button', () => {
      expect(jobLogsContainerInteractor.viewAllLogsButton.text).to.equal(translations.viewAllLogs);
    });

    describe('clicking on view all logs button', () => {
      beforeEach(async () => {
        await jobLogsContainerInteractor.viewAllLogsButton.click();
      });

      it('should navigate to all logs pane', () => {
        expect(allLogsPaneInteractor.isPresent).to.be.true;
      });

      it('should navigate to correct path', function () {
        expect(this.location.pathname.includes('/data-export/job-logs')).to.be.true;
        expect(this.location.search.includes('?sort=-completedDate')).to.be.true;
      });
    });

    it('should be sorted by "completedDate" descending by default', () => {
      expect(getCellContent(0, columnIndexMapping.status)).to.equal('Completed with errors');
      expect(getCellContent(1, columnIndexMapping.status)).to.equal('Fail');
    });

    it('should render ID column', () => {
      expect(jobLogsContainerInteractor.logsList.headers(columnIndexMapping.hrId).text).to.equal(commonTranslations.jobExecutionHrId);
    });

    it('should render total column', () => {
      expect(jobLogsContainerInteractor.logsList.headers(columnIndexMapping.totalRecords).text).to.equal(translations.total);
    });

    it('should render run by user column', () => {
      expect(jobLogsContainerInteractor.logsList.headers(columnIndexMapping.runBy).text).to.equal(commonTranslations.runBy);
    });

    it('should render failed column', () => {
      expect(jobLogsContainerInteractor.logsList.headers(columnIndexMapping.errors).text).to.equal(translations.failed);
    });

    it('should populate ID cells correctly', () => {
      expect(getCellContent(0, columnIndexMapping.hrId)).to.equal('3');
      expect(getCellContent(1, columnIndexMapping.hrId)).to.equal('2');
    });

    it('should populate total cells correctly', () => {
      expect(getCellContent(0, columnIndexMapping.totalRecords)).to.equal('5000');
      expect(getCellContent(1, columnIndexMapping.totalRecords)).to.equal('');
      expect(getCellContent(2, columnIndexMapping.totalRecords)).to.equal('500');
    });

    it('should populate run by user cells correctly', () => {
      expect(getCellContent(0, columnIndexMapping.runBy)).to.equal(`${getUser(1).firstName} ${getUser(1).lastName}`);
      expect(getCellContent(1, columnIndexMapping.runBy)).to.equal(`${getUser(0).firstName} ${getUser(0).lastName}`);
      expect(getCellContent(2, columnIndexMapping.runBy)).to.equal(`${getUser(2).firstName} ${getUser(2).lastName}`);
    });

    it('should populate failed cells correctly', () => {
      expect(getCellContent(0, columnIndexMapping.errors)).to.equal('10');
      expect(getCellContent(1, columnIndexMapping.errors)).to.equal('');
      expect(getCellContent(2, columnIndexMapping.errors)).to.equal('');
    });

    describe('clicking on status header', () => {
      beforeEach(async () => {
        await jobLogsContainerInteractor.logsList.headers(columnIndexMapping.status).click();
      });

      it('should sort by status in ascending order', () => {
        expect(getCellContent(0, columnIndexMapping.status)).to.equal('Completed');
        expect(getCellContent(1, columnIndexMapping.status)).to.equal('Completed with errors');
        expect(getCellContent(2, columnIndexMapping.status)).to.equal('Fail');
      });

      it('should have the correct query in path', function () {
        expect(this.location.search.includes('direction=ascending&sort=status')).to.be.true;
      });

      describe('clicking on status header', () => {
        beforeEach(async () => {
          await jobLogsContainerInteractor.logsList.headers(columnIndexMapping.status).click();
        });

        it('should sort by status in descending order', () => {
          expect(getCellContent(0, columnIndexMapping.status)).to.equal('Fail');
          expect(getCellContent(1, columnIndexMapping.status)).to.equal('Completed with errors');
          expect(getCellContent(2, columnIndexMapping.status)).to.equal('Completed');
        });

        it('should have the correct query in path', function () {
          expect(this.location.search.includes('direction=descending&sort=status')).to.be.true;
        });
      });
    });

    describe('clicking on file name with success flow', () => {
      beforeEach(async () => {
        await jobLogsContainerInteractor.fileNameBtns(0).click();
      });

      it('should not show error notification', () => {
        expect(jobLogsContainerInteractor.callout.errorCalloutIsPresent).to.be.false;
      });
    });

    describe('clicking on a row', () => {
      describe('with failed status', () => {
        beforeEach(async () => {
          await jobLogsContainerInteractor.logsList.rows(1).click();
        });

        it('should open error log', () => {
          expect(errorLogsInteractor.isPresent).to.be.true;
        });
      });

      describe('with completed with errors status', () => {
        beforeEach(async () => {
          await jobLogsContainerInteractor.logsList.rows(0).click();
        });

        it('should open error log', () => {
          expect(errorLogsInteractor.isPresent).to.be.true;
        });
      });

      describe('with completed status', () => {
        beforeEach(async () => {
          await jobLogsContainerInteractor.logsList.rows(2).click();
        });

        it('should not open error log', () => {
          expect(errorLogsInteractor.isPresent).to.be.false;
        });
      });
    });
  });

  describe('error scenario', () => {
    setupApplication({ scenarios: ['fetch-job-executions-success', 'fetch-get-download-link-error'] });

    beforeEach(async function () {
      this.visit('/data-export');
      await jobLogsContainerInteractor.fileNameBtns(0).click();
    });

    it('should show error notification', () => {
      expect(jobLogsContainerInteractor.callout.errorCalloutIsPresent).to.be.true;
    });
  });
});
