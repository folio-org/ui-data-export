import React from 'react';

import { Job } from '@folio/stripes-data-transfer-components';

import JobDetails from '../JobDetails';

const ItemFormatter = job => (
  <Job
    key={job.id}
    job={job}
  >
    <JobDetails job={job} />
    {/* hide till it unneeded Ref UIDEXP-277
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
    </div> */}
  </Job>
);

export default ItemFormatter;
