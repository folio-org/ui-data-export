import React, { useContext } from 'react';

import {
  sortRunningJobs,
  JobsListAccordion,
} from '@folio/stripes-data-transfer-components';

import ItemFormatter from './ItemFormatter';
import { DataFetcherContext } from '../../../contexts/DataFetcherContext';

const RunningJobs = () => {
  const {
    jobs,
    hasLoaded,
  } = useContext(DataFetcherContext);

  return (
    <JobsListAccordion
      jobs={sortRunningJobs(jobs)}
      hasLoaded={hasLoaded}
      itemFormatter={ItemFormatter}
      titleId="ui-data-export.runningJobs"
      emptyMessageId="ui-data-export.noRunningJobsMessage"
    />
  );
};

export default RunningJobs;
