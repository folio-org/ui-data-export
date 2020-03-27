import React from 'react';

import {
  SettingsLabel,
  SearchForm,
} from '@folio/stripes-data-transfer-components';
import { Pane } from '@folio/stripes/components';

const MappingProfiles = () => {
  return (
    <Pane
      data-test-mapping-profiles-pane
      defaultWidth="fill"
      paneTitle={(
        <SettingsLabel
          messageId="ui-data-export.mappingProfilesTitle"
          iconKey="mappingProfiles"
          app="data-export"
        />
      )}
    >
      <SearchForm
        searchTerm=" "
        contextName="data-export"
        searchLabelKey="ui-data-export.search"
      />
    </Pane>
  );
};

export default MappingProfiles;
