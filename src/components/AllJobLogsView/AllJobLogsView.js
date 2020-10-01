import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  SearchAndSortPane,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  JOB_LOGS_STATUS_QUERY_VALUE,
} from '../../utils';
import { JobLogsContainer } from '../JobLogsContainer';

const excludedSortColumns = ['fileName'];
const findAllCql = `status=(${JOB_LOGS_STATUS_QUERY_VALUE})`;
const sortMap = {
  totalRecords: 'progress.total',
  errors: 'progress.failed',
  updated: 'metadata.updatedDate',
  runBy: 'runBy.firstName runBy.lastName',
};

export const AllJobLogsViewComponent = ({
  resources,
  mutator,
}) => {
  return (
    <JobLogsContainer>
      {({
        listProps,
        onRowClick,
      }) => (
        <SearchAndSortPane
          objectName="job-executions"
          label={(
            <SettingsLabel
              messageId="ui-data-export.logsPaneTitle"
              iconKey="app"
              app="data-export"
            />
          )}
          resultCountMessageId="ui-data-export.searchResultsCountHeader"
          resourceName="jobExecutions"
          hasSearchForm={false}
          shouldSetInitialSort={false}
          lastMenu={<div />}
          defaultSort="completedDate"
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          shouldSetInitialSortOnMount={false}
          parentMutator={mutator}
          parentResources={resources}
          excludedSortColumns={excludedSortColumns}
          searchResultsProps={{
            rowProps: null,
            onRowClick,
          }}
          {...listProps}
        />
      )}
    </JobLogsContainer>
  );
};

AllJobLogsViewComponent.manifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: {
    initialValue: {
      query: '',
      filters: '',
      sort: '-completedDate',
    },
  },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  jobExecutions: {
    type: 'okapi',
    path: 'data-export/job-executions',
    records: 'jobExecutions',
    recordsRequired: '%{resultCount}',
    perRequest: RESULT_COUNT_INCREMENT,
    GET: {
      params: {
        query: makeQueryFunction(
          findAllCql,
          findAllCql,
          sortMap,
          [],
        ),
      },
      staticFallback: { params: {} },
    },
  },
});

AllJobLogsViewComponent.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

export const AllJobLogsView = stripesConnect(AllJobLogsViewComponent);
