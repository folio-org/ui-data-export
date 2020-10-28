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
    <div data-test-running-jobs>
      <JobsListAccordion
        jobs={sortRunningJobs(jobs)}
        hasLoaded={hasLoaded}
        itemFormatter={ItemFormatter}
        titleId="ui-data-export.runningJobs"
        emptyMessageId="ui-data-export.noRunningJobsMessage"
      />
    </div>
  );
};

export default RunningJobs;
