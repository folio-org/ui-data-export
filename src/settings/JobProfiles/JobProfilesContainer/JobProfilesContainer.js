import React from 'react';

import { SettingsLabel } from '@folio/stripes-data-transfer-components';
import { Pane } from '@folio/stripes/components';

const JobProfilesContainer = () => {
  return (
    <Pane
      data-test-job-profiles-pane
      defaultWidth="fill"
      paneTitle={(
        <SettingsLabel
          messageId="ui-data-export.jobProfilesTitle"
          iconKey="jobProfiles"
        />
      )}
    />
  );
};

export default JobProfilesContainer;
