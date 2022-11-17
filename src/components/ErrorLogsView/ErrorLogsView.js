import React from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { generateAffectedRecordInfo } from './utils';

import css from './ErrorLogsView.css';

const formatErrorReasonMessageValues = (errorMessageValues = []) => {
  return errorMessageValues.reduce((formattedValues, value, index) => {
    formattedValues[`value${index + 1}`] = value;

    return formattedValues;
  }, {});
};

export const ErrorLogsViewComponent = ({ resources: { log } }) => {
  const intl = useIntl();

  const {
    records: errorLogRecords,
    hasLoaded,
  } = log;

  if (!hasLoaded) {
    return <Preloader />;
  }

  return (
    <div
      data-test-error-logs-container
      className={css.errorLogsContainer}
    >
      {errorLogRecords?.map(errorLogRecord => (
        <div
          key={errorLogRecord.id}
          data-test-error-log
        >
          <div data-test-error-log-info>{errorLogRecord.createdDate} {errorLogRecord.logLevel} {intl.formatMessage(
            { id: `ui-data-export.${errorLogRecord.errorMessageCode}` },
            { ...formatErrorReasonMessageValues(errorLogRecord?.errorMessageValues) }
          )}
          </div>
          {errorLogRecord?.affectedRecord && (
            <div data-test-error-log-affected-record>
              {generateAffectedRecordInfo(errorLogRecord.affectedRecord, intl.formatMessage)
                .map((item, i) => <div key={i}>{item}</div>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

ErrorLogsViewComponent.propTypes = {
  resources: PropTypes.shape({
    log: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(PropTypes.shape({
        createdDate: PropTypes.string.isRequired,
        errorMessageCode: PropTypes.string.isRequired,
        errorMessageValues: PropTypes.arrayOf(PropTypes.string),
        id: PropTypes.string.isRequired,
        logLevel: PropTypes.string.isRequired,
      })),
    }),
  }).isRequired,
};

ErrorLogsViewComponent.manifest = Object.freeze({
  log: {
    type: 'okapi',
    records: 'errorLogs',
    resourceShouldRefresh: true,
    path: (_q, _p, _r, _l, props) => {
      const match = matchPath(props.location.pathname, {
        path: '/data-export/log/:id',
        exact: true,
        strict: false,
      });

      return `data-export/logs?limit=10000&query=(jobExecutionId==${match.params.id})`;
    },
  },
});

export const ErrorLogsView = stripesConnect(ErrorLogsViewComponent);
