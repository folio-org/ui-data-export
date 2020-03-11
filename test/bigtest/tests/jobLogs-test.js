import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

import translations from '../../../translations/ui-data-export/en';
import { setupApplication } from '../helpers';

const logsList = new MultiColumnListInteractor('#job-logs-list');
const getCellContent = (row, cell) => logsList.rows(row).cells(cell).content;

describe('Job logs list', () => {
  setupApplication({ scenarios: ['fetch-job-profiles-success'] });

  beforeEach(function () {
    this.visit('/data-export');
  });

  it('should display logs list', () => {
    expect(logsList.isPresent).to.be.true;
  });

  it('should add status column to the end', () => {
    expect(logsList.headers(6).text).to.equal(translations.status);
  });

  it('should be sorted by "completedDate" descending by default', () => {
    expect(getCellContent(0, 6)).to.equal('Fail');
    expect(getCellContent(1, 6)).to.equal('Success');
  });

  describe('clicking on status header', () => {
    beforeEach(async () => {
      await logsList.headers(6).click();
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
        await logsList.headers(6).click();
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
