import React, { memo } from 'react';

import { AccordionSet } from '@folio/stripes/components';

import RunningJobs from './RunningJobs';

import css from './Jobs.css';

export const Jobs = memo(() => (
  <div
    data-test-jobs-container
    className={css.jobsContainer}
  >
    <AccordionSet>
      <RunningJobs />
    </AccordionSet>
  </div>
));
