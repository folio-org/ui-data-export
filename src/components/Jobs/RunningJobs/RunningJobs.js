import React, { useContext } from 'react';

import { isEmpty } from 'lodash';

import {
  sortRunningJobs,
  JobsListAccordion,
} from '@folio/stripes-data-transfer-components';

import { JOB_STATUSES } from '../../../utils/constants';
import ItemFormatter from './ItemFormatter';
import tempData from './tempData';
import { DataFetcherContext } from '../../../contexts/DataFetcherContext';

const prepareJobsData = jobs => {
  const jobStatuses = [JOB_STATUSES.RUNNING];
  const filteredJobs = jobs.filter(({ uiStatus }) => jobStatuses.includes(uiStatus));

  return sortRunningJobs(filteredJobs);
};

const RunningJobs = () => {
  const {
    jobs: realData,
    hasLoaded,
  } = useContext(DataFetcherContext);
  const jobs = isEmpty(realData) ? tempData : realData; // TODO: remove tempData once backend is ready (MDEXP-69)

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
