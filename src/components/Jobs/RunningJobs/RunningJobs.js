import React, { useContext } from 'react';
import { isEmpty } from 'lodash';

import {
  sortRunningJobs,
  JobsListAccordion,
} from '@folio/stripes-data-transfer-components';

import { JOB_EXECUTION_STATUSES } from '../../../utils/constants';
import ItemFormatter from './ItemFormatter';
import { DataFetcherContext } from '../../../contexts/DataFetcherContext';
import { sampleJobExecution } from '../../../../test/bigtest/network/scenarios/fetch-job-profiles-success';

const prepareJobsData = jobs => {
  const jobStatuses = [JOB_EXECUTION_STATUSES.IN_PROGRESS];
  const filteredJobs = jobs.filter(({ status }) => jobStatuses.includes(status));

  return sortRunningJobs(filteredJobs);
};

const RunningJobs = () => {
  const {
    jobs: realData,
    hasLoaded,
  } = useContext(DataFetcherContext);
  const jobs = isEmpty(realData) ? [sampleJobExecution] : realData; // TODO: remove sampleJobExecution once backend is ready (MDEXP-69)

  return (
    <JobsListAccordion
      jobs={prepareJobsData(jobs)}
      hasLoaded={hasLoaded}
      itemFormatter={ItemFormatter}
      titleId="ui-data-export.runningJobs"
      emptyMessageId="ui-data-export.noRunningJobsMessage"
    />
  );
};

export default RunningJobs;
