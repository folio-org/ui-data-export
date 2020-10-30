import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import { expect } from 'chai';
import Pretender from 'pretender';
import { cleanup } from '@bigtest/react';
import {
  describe,
  before,
  beforeEach,
  afterEach,
  it,
} from '@bigtest/mocha';

import {
  mountWithContext,
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/interactors';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { Paneset } from '@folio/stripes/components';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import translations from '../../../../translations/ui-data-export/en';
import { allLogsPaneInteractor } from '../../interactors';
import { AllJobLogsViewComponent } from '../../../../src/components/AllJobLogsView';
import { getColumnIndexMapping } from '../../helpers';
import {
  OverlayContainer,
  translationsProperties,
} from '../../../helpers';
import { logJobExecutions } from '../../network/scenarios/fetch-job-executions-success';
import { DEFAULT_JOB_LOG_COLUMNS } from '../../../../src/utils';

const {
  searchResults,
  header,
} = allLogsPaneInteractor.searchAndSort;
const { getCellContent } = searchResults;
const getUser = row => logJobExecutions[row].runBy;
const columnIndexMapping = getColumnIndexMapping(DEFAULT_JOB_LOG_COLUMNS);

describe('AllJobLogsView', () => {
  before(async () => {
    await cleanup();
  });

  beforeEach(async () => {
    window.history.pushState({}, document.title, '/?sort=-completedDate');
  });

  afterEach(async () => {
    window.history.pushState({}, document.title, '/?sort=-completedDate');
  });

  beforeEach(async () => {
    await mountWithContext(
      <StripesContext.Provider
        value={{
          okapi: { url: '' },
          logger: { log: noop },
        }}
      >
        <Router>
          <Paneset>
            <AllJobLogsViewComponent
              resources={buildResources({
                resourceName: 'jobExecutions',
                records: logJobExecutions,
              })}
              mutator={buildMutator()}
            />
          </Paneset>
          <OverlayContainer />
        </Router>
      </StripesContext.Provider>,
      translationsProperties,
    );
  });

  it('should display logs list', () => {
    expect(allLogsPaneInteractor.isPresent).to.be.true;
  });

  it('should display correct title', () => {
    expect(header.title.labelText).to.equal(translations.logsPaneTitle);
  });

  it('should contain icon in title', () => {
    expect(header.title.icon.isPresent).to.be.true;
  });

  it('should display correct subtitle', () => {
    expect(header.subTitleText).to.equal('3 records found');
  });

  it('should be sorted by "completedDate" descending', () => {
    expect(searchResults.list.headers(columnIndexMapping.completedDate).$root.getAttribute('aria-sort')).to.equal('descending');
  });

  it('should render list columns', () => {
    expect(searchResults.list.headers(columnIndexMapping.hrId).text).to.equal(commonTranslations.jobExecutionHrId);
    expect(searchResults.list.headers(columnIndexMapping.totalRecords).text).to.equal(translations.total);
    expect(searchResults.list.headers(columnIndexMapping.runBy).text).to.equal(commonTranslations.runBy);
    expect(searchResults.list.headers(columnIndexMapping.errors).text).to.equal(translations.failed);
  });

  it('should populate ID cells', () => {
    expect(getCellContent(0, columnIndexMapping.hrId)).to.equal('2');
    expect(getCellContent(1, columnIndexMapping.hrId)).to.equal('3');
    expect(getCellContent(2, columnIndexMapping.hrId)).to.equal('1');
  });

  it('should populate records cells', () => {
    expect(getCellContent(0, columnIndexMapping.totalRecords)).to.equal('');
    expect(getCellContent(1, columnIndexMapping.totalRecords)).to.equal('5000');
    expect(getCellContent(2, columnIndexMapping.totalRecords)).to.equal('500');
  });

  it('should populate run by user cells', () => {
    expect(getCellContent(0, columnIndexMapping.runBy)).to.equal(`${getUser(0).firstName} ${getUser(0).lastName}`);
    expect(getCellContent(1, columnIndexMapping.runBy)).to.equal(`${getUser(1).firstName} ${getUser(1).lastName}`);
    expect(getCellContent(2, columnIndexMapping.runBy)).to.equal(`${getUser(2).firstName} ${getUser(2).lastName}`);
  });

  it('should populate failed cells', () => {
    expect(getCellContent(0, columnIndexMapping.errors)).to.equal('');
    expect(getCellContent(1, columnIndexMapping.errors)).to.equal('10');
    expect(getCellContent(2, columnIndexMapping.errors)).to.equal('');
  });

  describe('clicking on status column header', () => {
    beforeEach(async () => {
      await searchResults.list.headers(columnIndexMapping.status).click();
    });

    it('should have the correct query in path', function () {
      expect(decodeURIComponent(window.location.search).includes('?sort=status,-completedDate')).to.be.true;
    });

    describe('clicking on status header', () => {
      beforeEach(async () => {
        await searchResults.list.headers(columnIndexMapping.status).click();
      });

      it('should have the correct query in path', function () {
        expect(decodeURIComponent(window.location.search).includes('?sort=-status,-completedDate')).to.be.true;
      });
    });

    describe('clicking on file name with error flow', () => {
      const callout = new CalloutInteractor();

      beforeEach(async () => {
        await allLogsPaneInteractor.fileNameBtns(1).click();
      });

      it('should show error notification', () => {
        expect(callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('clicking on file name with success flow', () => {
      let server;
      const callout = new CalloutInteractor();

      beforeEach(() => {
        server = new Pretender();
      });

      afterEach(() => {
        server.shutdown();
      });

      beforeEach(async () => {
        server.get('/data-export/job-executions/:id/download/:file', () => [
          200,
          { 'content-type': 'application/json' },
          JSON.stringify('downloadlink'),
        ]);
        await allLogsPaneInteractor.fileNameBtns(0).click();
      });

      it('should not show error notification', () => {
        expect(callout.errorCalloutIsPresent).to.be.false;
      });
    });
  });
});
