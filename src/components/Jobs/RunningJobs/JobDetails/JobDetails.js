import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { get } from 'lodash';

import {
  FormattedTime,
  FormattedDate,
} from '@folio/stripes/components';
import {
  jobExecutionPropTypes,
  Progress,
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
    jobProfileName,
    exportedFiles,
    hrId,
    runBy,
    progress: {
      total = 0,
      exported = 0,
      otherFailed = 0,
      duplicatedSrs = 0,
      readIds = 0,
    } = {},
    startedDate,
  } = job;

  return (
    <>
      <div className={classNames(css.delimiter, css.jobHeader)}>
        <span data-test-running-job-profile>{jobProfileName}</span>
        <span data-test-running-job-file-name>{get(exportedFiles, '0.fileName')}</span>
      </div>
      <div className={css.delimiter}>
        <span data-test-running-job-hr-id>{hrId}</span>
        {runBy &&
          (
            <span data-test-running-job-triggered-by>
              <FormattedMessage
                id="ui-data-export.triggeredBy"
                values={{ userName: `${runBy.firstName} ${runBy.lastName}` }}
              />
            </span>
          )
        }
      </div>
      <div className={css.delimiter}>
        <span>
          <FormattedMessage
            id="ui-data-export.totalRecords"
            values={{ countOfRecords: total }}
          />
        </span>
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
      <Progress
        current={(readIds + exported + Number(otherFailed)) - Number(duplicatedSrs)}
        total={Number(total) * 2}
      />
    </>
  );
};

JobDetails.propTypes = { job: jobExecutionPropTypes.isRequired };

export default JobDetails;
