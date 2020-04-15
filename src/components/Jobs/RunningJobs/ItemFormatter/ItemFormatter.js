import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import { Job } from '@folio/stripes-data-transfer-components';

import JobDetails from '../JobDetails';

import css from './ItemFormatter.css';

const ItemFormatter = job => (
  <Job
    key={job.id}
    job={job}
  >
    <JobDetails job={job} />
    <div
      data-test-running-job-buttons-container
      className={css.buttonsContainer}
    >
      <Button
        data-test-cancel-job-running
        buttonStyle="primary"
        marginBottom0
        disabled
      >
        <FormattedMessage id="ui-data-export.cancel" />
      </Button>
      <Button
        data-test-pause-job-running
        buttonStyle="primary"
        marginBottom0
        disabled
      >
        <FormattedMessage id="ui-data-export.pause" />
      </Button>
      <Button
        data-test-resume-job-running
        buttonStyle="primary"
        marginBottom0
        disabled
      >
        <FormattedMessage id="ui-data-export.resume" />
      </Button>
    </div>
  </Job>
);

export default ItemFormatter;
