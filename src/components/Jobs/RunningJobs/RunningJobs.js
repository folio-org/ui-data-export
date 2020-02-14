import React from 'react';

import {
  sortRunningJobs,
  JobsListAccordion,
} from '@folio/stripes-data-transfer-components';

import { JOB_STATUSES } from '../../../utils/constants';
import ItemFormatter from './ItemFormatter';
import tempData from './tempData';

const prepareJobsData = jobs => {
  const jobStatuses = [JOB_STATUSES.RUNNING];
  const filteredJobs = jobs.filter(({ uiStatus }) => jobStatuses.includes(uiStatus));

  return sortRunningJobs(filteredJobs);
};

const RunningJobs = () => {
  const hasLoaded = true;
  const jobs = prepareJobsData(tempData);

  return (
    <JobsListAccordion
      jobs={jobs}
      hasLoaded={hasLoaded}
      itemFormatter={ItemFormatter}
      titleId="ui-data-export.runningJobs"
      emptyMessageId="ui-data-export.noRunningJobsMessage"
    />
  );
};

export default RunningJobs;
