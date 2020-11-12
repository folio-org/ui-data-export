import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@bigtest/react';
import {
  describe,
  before,
  beforeEach,
  it,
} from '@bigtest/mocha';

import {
  mountWithContext,
  buildResources,
  buildMutator,
  PreloaderInteractor,
} from '@folio/stripes-data-transfer-components/interactors';

import { ErrorLogsViewComponent } from '../../../../../src/components/ErrorLogsView';
import { translationsProperties } from '../../../../helpers';
import { errorLogs } from '../../../fixtures/errorLogs';
import { errorLogsInteractor } from './interactor';

describe('ErrorLogsView', () => {
  before(async () => {
    await cleanup();
  });

  describe('rendering error logs page with data', () => {
    beforeEach(async () => {
      await mountWithContext(
        <ErrorLogsViewComponent
          resources={buildResources({
            resourceName: 'log',
            records: errorLogs,
          })}
          mutator={buildMutator()}
        />,
        translationsProperties
      );
    });

    it('should display error logs page', () => {
      expect(errorLogsInteractor.isPresent).to.be.true;
    });

    it('should display proper amount of logs', () => {
      expect(errorLogsInteractor.logsCount).to.equal(errorLogs.length);
    });

    it('should display proper log info', () => {
      expect(errorLogsInteractor.logs(0).logInfo).to.equal('2020-10-13T09:35:16.481+0000 ERROR reason1');
      expect(errorLogsInteractor.logs(1).logInfo).to.equal('2020-10-13T09:35:16.485+0000 ERROR reason2');
      expect(errorLogsInteractor.logs(2).logInfo).to.equal('2020-10-13T09:35:16.484+0000 ERROR reason3');
    });

    it('should display info about affected record only for the one record', () => {
      expect(errorLogsInteractor.logs(0).affectedRecord.isPresent).to.be.false;
      expect(errorLogsInteractor.logs(1).affectedRecord.isPresent).to.be.false;
      expect(errorLogsInteractor.logs(2).affectedRecord.isPresent).to.be.true;
    });
  });

  describe('rendering error logs page in loading state', () => {
    const preloader = new PreloaderInteractor();

    beforeEach(async () => {
      await mountWithContext(
        <ErrorLogsViewComponent
          resources={buildResources({
            resourceName: 'log',
            hasLoaded: false,
          })}
          mutator={buildMutator()}
        />,
        translationsProperties
      );
    });

    it('should display preloader', () => {
      expect(preloader.spinner.isPresent).to.be.true;
    });
  });
});

describe('ErrorLogsView manifest path function', () => {
  const { manifest } = ErrorLogsViewComponent;

  it('should return proper URL', () => {
    const recordId = 'recordId';

    expect(
      manifest.log.path(
        null,
        null,
        null,
        null,
        { location: { pathname: `/data-export/log/${recordId}` } }
      )
    ).to.equal(`data-export/logs?query=(jobExecutionId==${recordId})`);
  });
});
