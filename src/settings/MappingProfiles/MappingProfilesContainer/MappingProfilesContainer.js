import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  match as matchShape,
  history as historyShape,
  location as locationShape,
} from 'react-router-prop-types';

import {
  Route,
  stripesConnect,
} from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import {
  MappingProfiles,
  getMappingProfilesColumnProperties,
  DEFAULT_MAPPING_PROFILES_COLUMNS,
  getMappingProfilesItemFormatter,
} from '@folio/stripes-data-transfer-components';

import { MappingProfilesForm } from '../MappingProfilesForm';
import {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  FIND_ALL_CQL,
} from '../../../utils';

const customProperties = getMappingProfilesColumnProperties({
  columnWidths: { format: '70px' },
  columnMapping: { format: <FormattedMessage id="ui-data-export.format" /> },
  visibleColumns: [
    DEFAULT_MAPPING_PROFILES_COLUMNS.NAME,
    DEFAULT_MAPPING_PROFILES_COLUMNS.FOLIO_RECORD,
    'format',
    DEFAULT_MAPPING_PROFILES_COLUMNS.UPDATED,
    DEFAULT_MAPPING_PROFILES_COLUMNS.UPDATED_BY,
  ],
});

const queryTemplate = '(sortby "%{query.query}")';
const sortMap = {
  name: 'name',
  folioRecord: 'recordTypes',
  format: 'outputFormat',
  updated: 'metadata.updatedDate',
  updatedBy: 'userInfo.firstName userInfo.lastName',
};

const MappingProfilesContainer = ({
  history,
  match,
  location,
  mutator,
  resources,
}) => {
  return (
    <>
      <MappingProfiles
        parentResources={resources}
        parentMutator={mutator}
        formatter={getMappingProfilesItemFormatter({ format: ({ outputFormat }) => outputFormat })}
        {...customProperties}
      />
      <Route
        path={`${match.path}/create`}
        render={props => (
          <MappingProfilesForm
            {...props}
            onSubmit={() => {
              // TODO: Add transition to mapping profiles list, backend communication, etc.
              // The functions receives form values as an argument
            }}
            onCancel={() => history.push(`${match.path}${location.search}`)}
          />
        )}
      />
    </>
  );
};

MappingProfilesContainer.propTypes = {
  match: matchShape.isRequired,
  mutator: PropTypes.object.isRequired,
  history: historyShape.isRequired,
  location: locationShape.isRequired,
  resources: PropTypes.object.isRequired,
};

MappingProfilesContainer.manifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  mappingProfiles: {
    type: 'okapi',
    path: 'data-export/mappingProfiles',
    records: 'mappingProfiles',
    recordsRequired: '%{resultCount}',
    perRequest: RESULT_COUNT_INCREMENT,
    clientGeneratePk: false,
    throwErrors: false,
    GET: {
      params: {
        query: makeQueryFunction(
          FIND_ALL_CQL,
          queryTemplate,
          sortMap,
          [],
        ),
      },
      staticFallback: { params: {} },
    },
  },
});

export default stripesConnect(MappingProfilesContainer);
