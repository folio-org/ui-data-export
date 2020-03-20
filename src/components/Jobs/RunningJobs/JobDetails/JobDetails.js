import React from 'react';
import {
  FormattedMessage,
  FormattedTime,
  FormattedDate,
} from 'react-intl';
import classNames from 'classnames';
import { get } from 'lodash';

import { jobExecutionPropTypes } from '@folio/stripes-data-transfer-components';

import css from '@folio/stripes-data-transfer-components/lib/Jobs/Job/Job.css';

const checkDateIsToday = dateStr => {
  return new Date().toDateString() === new Date(dateStr).toDateString();
};

const formatTime = dateStr => {
  const isToday = checkDateIsToday(dateStr);
  const datePart = !isToday && <FormattedDate value={dateStr} />;
  const timePart = <FormattedTime value={dateStr} />;
  const todayPart = isToday && <FormattedMessage id="ui-data-export.today" />;

  return <span>{datePart} {timePart} {todayPart}</span>;
};

// TODO: remove defaults for jobProfileInfo once backend is in place
const JobDetails = props => {
  const { job } = props;

  const {
    jobProfileInfo,
    exportedFiles,
    hrId,
    runBy: {
      firstName,
      lastName,
    },
    startedDate,
  } = job;

  return (
    <>
      <div className={classNames(css.delimiter, css.jobHeader)}>
        <span data-test-running-job-profile>{get(jobProfileInfo, 'name', 'default')}</span>
        <span data-test-running-job-file-name>{get(exportedFiles, '0.fileName')}</span>
      </div>
      <div className={css.delimiter}>
        <span data-test-running-job-hr-id>{hrId}</span>
        <span data-test-running-job-triggered-by>
          <FormattedMessage
            id="ui-data-export.triggeredBy"
            values={{ userName: `${firstName} ${lastName}` }}
          />
        </span>
      </div>
      <div className={css.delimiter}>
        <span data-test-running-job-date-label>
          <FormattedMessage
            id="ui-data-export.beganRunning"
            values={{ time: formatTime(startedDate) }}
          />
        </span>
      </div>
      <FormattedMessage
        data-test-running-job-progress-status
        id="ui-data-export.inProgressStatus"
        tagName="div"
      />
    </>
  );
};

JobDetails.propTypes = { job: jobExecutionPropTypes.isRequired };

export default JobDetails;
