import React from 'react';
import { matchPath } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  OverlayView,
  Preloader,
} from '@folio/stripes-data-transfer-components';

import { generateAffectedRecordInfo } from './utils';

import css from './ErrorLogsView.css';

export const ErrorLogsViewComponent = ({ resources: { log } }) => {
  const {
    records: errorLogRecords,
    hasLoaded,
  } = log;

  if (!hasLoaded) {
    return <Preloader />;
  }

  return (
    <OverlayView>
      <div
        data-test-error-logs-container
        className={css.errorLogsContainer}
      >
        {errorLogRecords.map(errorLogRecord => (
          <div
            key={errorLogRecord.id}
            data-test-error-log
          >
            <div data-test-error-log-info>{errorLogRecord.createdDate} {errorLogRecord.logLevel} {errorLogRecord.reason}</div>
            {errorLogRecord.affectedRecord && (
              <div data-test-error-log-affected-record>
                {generateAffectedRecordInfo(errorLogRecord.affectedRecord)
                  .map((item, i) => <div key={i}>{item}</div>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </OverlayView>
  );
};

ErrorLogsViewComponent.manifest = Object.freeze({
  log: {
    type: 'okapi',
    records: 'errorLogs',
    path: (_q, _p, _r, _l, props) => {
      const match = matchPath(props.location.pathname, {
        path: '/data-export/log/:id',
        exact: true,
        strict: false,
      });

      return `data-export/logs?query=(jobExecutionId==${match.params.id})`;
    },
  },
});

export const ErrorLogsView = stripesConnect(ErrorLogsViewComponent);
