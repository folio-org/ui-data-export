import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Paneset,
  Pane,
  Button,
} from '@folio/stripes/components';
import {
  AppIcon,
  stripesConnect,
} from '@folio/stripes/core';
import {
  DataFetcher,
  createUrl,
} from '@folio/stripes-data-transfer-components';

import {
  QueryFileUploader,
  Jobs,
  RecentJobLogs,
} from '../components';
import { DataFetcherContext } from '../contexts/DataFetcherContext';
import {
  JOB_EXECUTION_STATUSES,
  JOB_LOGS_STATUS_QUERY_VALUE,
} from '../utils';

function Home(props) {
  const viewAllLogsButton = (
    <Button
      buttonStyle="primary paneHeaderNewButton"
      data-test-view-all-logs-button
      marginBottom0
      to="/data-export/job-logs?qindex=hrID"
    >
      <FormattedMessage id="ui-data-export.viewAllLogs" />
    </Button>
  );

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
          appIcon={(
            <AppIcon
              app="data-export"
            />
          )}
          paneTitle={(
            <span data-test-title>
              <FormattedMessage id="ui-data-export.logsPaneTitle" />
            </span>
          )}
          lastMenu={viewAllLogsButton}
        >
          <RecentJobLogs />
        </Pane>
      </DataFetcher>
    </Paneset>
  );
}

const jobsUrl = createUrl('data-export/job-executions', {
  query: `status=(${JOB_EXECUTION_STATUSES.IN_PROGRESS})`,
  limit: 50,
}, false);

const logsUrl = createUrl('data-export/job-executions', {
  query: `status=(${JOB_LOGS_STATUS_QUERY_VALUE}) sortBy completedDate/sort.descending`,
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
