import React, { useContext } from 'react';

import {
  JobLogs,
  DEFAULT_JOB_LOGS_SORT_COLUMNS,
  sortStrings,
  sortNumbers,
  sortDates,
} from '@folio/stripes-data-transfer-components';
import { stripesConnect } from '@folio/stripes/core';

import { DataFetcherContext } from '../../contexts/DataFetcherContext';
import { JobLogsContainer } from '../JobLogsContainer';

const sortColumns = {
  ...DEFAULT_JOB_LOGS_SORT_COLUMNS,
  errors: {
    sortFn: sortNumbers,
    useFormatterFn: true,
  },
  status: {
    sortFn: sortStrings,
    useFormatterFn: true,
  },
  exported: {
    sortFn: sortNumbers,
    useFormatterFn: true,
  },
  startedDate: {
    sortFn: sortDates,
    useFormatterFn: true,
  },
};

const RecentJobLogsComponent = () => {
  const {
    logs,
    hasLoaded,
  } = useContext(DataFetcherContext);

  return (
    <JobLogsContainer>
      {({
        listProps,
        onRowClick,
      }) => (
        <JobLogs
          sortColumns={sortColumns}
          hasLoaded={hasLoaded}
          contentData={logs}
          formatter={listProps.resultsFormatter}
          onRowClick={onRowClick}
          {...listProps}
        />
      )}
    </JobLogsContainer>
  );
};

export const RecentJobLogs = stripesConnect(RecentJobLogsComponent);
