import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  MappingProfiles,
  getMappingProfilesColumnProperties,
  DEFAULT_MAPPING_PROFILES_COLUMNS,
  getMappingProfilesItemFormatter,
} from '@folio/stripes-data-transfer-components';

import tempData from './tempData';

const customProperties = {
  columnWidths: { format: '70px' },
  columnMapping: { format: <FormattedMessage id="ui-data-export.format" /> },
};

const visibleColumns = [
  DEFAULT_MAPPING_PROFILES_COLUMNS.NAME,
  DEFAULT_MAPPING_PROFILES_COLUMNS.FOLIO_RECORD,
  'format',
  DEFAULT_MAPPING_PROFILES_COLUMNS.UPDATED,
  DEFAULT_MAPPING_PROFILES_COLUMNS.UPDATED_BY,
];

const MappingProfilesContainer = () => {
  return (
    <MappingProfiles
      // TODO: temp solution to simulate mutators and resources that should be removed after integration with backend
      parentResources={{
        query: {
          sort: new URLSearchParams(window.location.search).get('sort') || '',
          query: new URLSearchParams(window.location.search).get('query') || '',
        },
        mappingProfiles: {
          records: tempData.profiles,
          hasLoaded: true,
          isPending: false,
          other: { totalRecords: 4 },
        },
      }}
      parentMutator={{
        resultCount: { replace: () => { } },
        resultOffset: { replace: () => { } },
      }}
      formatter={getMappingProfilesItemFormatter({ format: record => record.format })}
      {...getMappingProfilesColumnProperties({
        visibleColumns,
        customProperties,
      })}
    />
  );
};

export default MappingProfilesContainer;
