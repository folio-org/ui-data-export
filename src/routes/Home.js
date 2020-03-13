import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Paneset,
  Pane,
} from '@folio/stripes-components';
import { stripesConnect } from '@folio/stripes/core';
import {
  DataFetcher,
  createUrl,
} from '@folio/stripes-data-transfer-components';

import {
  QueryFileUploader,
  Jobs,
  JobLogsContainer,
} from '../components';
import { DataFetcherContext } from '../contexts/DataFetcherContext';
import { JOB_EXECUTION_STATUSES } from '../utils/constants';

function Home(props) {
  return (
    <Paneset>
      <DataFetcher
        FetcherContext={DataFetcherContext}
        resources={props.resources}
        mutator={props.mutator}
        resourcesMappingPath="records.0.jobExecutions"
      >
        <Pane
          data-test-jobs-pane
          defaultWidth="320px"
          paneTitle={(
            <span data-test-title>
              <FormattedMessage id="ui-data-export.jobsPaneTitle" />
            </span>
          )}
        >
          <QueryFileUploader />
          <Jobs />
        </Pane>
        <Pane
          data-test-logs-pane
          defaultWidth="fill"
          paneTitle={(
            <span data-test-title>
              <FormattedMessage id="ui-data-export.logsPaneTitle" />
            </span>
          )}
        >
          <JobLogsContainer />
        </Pane>
      </DataFetcher>
    </Paneset>
  );
}

const jobsUrl = createUrl('data-export/jobExecutions', {
  query: `status=(${JOB_EXECUTION_STATUSES.IN_PROGRESS})`,
  limit: 50,
}, false);

const logsUrl = createUrl('data-export/jobExecutions', {
  query: `status=(${JOB_EXECUTION_STATUSES.SUCCESS} OR ${JOB_EXECUTION_STATUSES.FAIL})`,
  limit: 25,
}, false);

Home.manifest = Object.freeze({
  jobs: {
    type: 'okapi',
    path: jobsUrl,
    accumulate: true,
    throwErrors: false,
  },
  logs: {
    type: 'okapi',
    path: logsUrl,
    accumulate: true,
    throwErrors: false,
  },
});

export default stripesConnect(Home);
