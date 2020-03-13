import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translations from '../../../translations/ui-data-export/en';
import { setupApplication } from '../helpers';
import { jobLogsContainerInteractor } from '../interactors';

const getCellContent = (row, cell) => jobLogsContainerInteractor.logsList.rows(row).cells(cell).content;

describe('Job logs list', () => {
  describe('default scenario', () => {
    setupApplication();

    beforeEach(function () {
      this.visit('/data-export');
    });

    it('should display logs list', () => {
      expect(jobLogsContainerInteractor.logsList.isPresent).to.be.true;
    });

    it('should add status column to the end', () => {
      expect(jobLogsContainerInteractor.logsList.headers(6).text).to.equal(translations.status);
    });

    it('should be sorted by "completedDate" descending by default', () => {
      expect(getCellContent(0, 6)).to.equal('Fail');
      expect(getCellContent(1, 6)).to.equal('Success');
    });

    describe('clicking on status header', () => {
      beforeEach(async () => {
        await jobLogsContainerInteractor.logsList.headers(6).click();
      });

      it('should sort by status in ascending order', () => {
        expect(getCellContent(0, 6)).to.equal('Fail');
        expect(getCellContent(1, 6)).to.equal('Success');
      });

      it('should have the correct query in path', function () {
        expect(this.location.search.includes('direction=ascending&sort=status')).to.be.true;
      });

      describe('clicking on status header', () => {
        beforeEach(async () => {
          await jobLogsContainerInteractor.logsList.headers(6).click();
        });

        it('should sort by status in descending order', () => {
          expect(getCellContent(1, 6)).to.equal('Fail');
          expect(getCellContent(0, 6)).to.equal('Success');
        });

        it('should have the correct query in path', function () {
          expect(this.location.search.includes('direction=descending&sort=status')).to.be.true;
        });
      });
    });
  });
});
