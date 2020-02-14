import React from 'react';
import {
  FormattedMessage,
  FormattedTime,
  FormattedDate,
} from 'react-intl';
import classNames from 'classnames';

import {
  Progress,
  jobExecutionPropTypes,
} from '@folio/stripes-data-transfer-components';

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

const JobDetails = props => {
  const { job } = props;

  const {
    jobProfileInfo,
    fileName,
    hrId,
    runBy: {
      firstName,
      lastName,
    },
    progress: {
      current,
      total,
    },
    startedDate,
  } = job;

  return (
    <>
      <div className={classNames(css.delimiter, css.jobHeader)}>
        <span data-test-running-job-profile>{jobProfileInfo.name}</span>
        <span data-test-running-job-file-name>{fileName}</span>
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
      <>
        <FormattedMessage
          data-test-running-job-progress-status
          id="ui-data-export.inProgressStatus"
          tagName="div"
        />
        <Progress
          current={current}
          total={total}
        />
      </>
    </>
  );
};

JobDetails.propTypes = { job: jobExecutionPropTypes.isRequired };

export default JobDetails;
