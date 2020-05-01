import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  match as matchShape,
  history as historyShape,
  location as locationShape,
} from 'react-router-prop-types';

import { Route } from '@folio/stripes/core';
import {
  MappingProfiles,
  getMappingProfilesColumnProperties,
  DEFAULT_MAPPING_PROFILES_COLUMNS,
  getMappingProfilesItemFormatter,
} from '@folio/stripes-data-transfer-components';

import { MappingProfilesForm } from '../MappingProfilesForm';
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

const MappingProfilesContainer = ({
  history,
  match,
  location,
}) => {
  return (
    <>
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
      <Route
        path={`${match.path}/create`}
        render={props => (
          <MappingProfilesForm
            {...props}
            onCancel={() => history.push(`${match.path}${location.search}`)}
          />
        )}
      />
    </>
  );
};

MappingProfilesContainer.propTypes = {
  match: matchShape.isRequired,
  history: historyShape.isRequired,
  location: locationShape.isRequired,
};

export default MappingProfilesContainer;
