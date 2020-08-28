import React from 'react';
import PropTypes from 'prop-types';
import {
  match as matchShape,
  history as historyShape,
  location as locationShape,
} from 'react-router-prop-types';

import { Route } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import {
  MappingProfiles,
  useMappingProfilesProperties,
  DEFAULT_MAPPING_PROFILES_COLUMNS,
  useMappingProfileListFormatter,
} from '@folio/stripes-data-transfer-components';

import {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  FIND_ALL_CQL,
} from '../../../utils';
import { NewMappingProfileFormRoute } from '../NewMappingProfileFormRoute';
import { MappingProfileDetailsRoute } from '../MappingProfileDetailsRoute';
import { EditMappingProfileRoute } from '../EditMappingProfileRoute';

const customProperties = {
  columnWidths: { format: '70px' },
  columnMapping: { format: 'ui-data-export.format' },
  visibleColumns: [
    DEFAULT_MAPPING_PROFILES_COLUMNS.NAME,
    DEFAULT_MAPPING_PROFILES_COLUMNS.FOLIO_RECORD,
    'format',
    DEFAULT_MAPPING_PROFILES_COLUMNS.UPDATED,
    DEFAULT_MAPPING_PROFILES_COLUMNS.UPDATED_BY,
  ],
};

const queryTemplate = '(sortby "%{query.query}")';
const sortMap = {
  name: 'name',
  folioRecord: 'recordTypes',
  format: 'outputFormat',
  updated: 'metadata.updatedDate',
  updatedBy: 'userInfo.firstName userInfo.lastName',
};

const initialValues = {
  transformations: [],
  recordTypes: [],
  outputFormat: 'MARC',
};

const MappingProfilesContainer = ({
  history,
  match,
  location,
  resources,
  mutator,
}) => {
  return (
    <>
      <MappingProfiles
        parentResources={resources}
        parentMutator={mutator}
        formatter={useMappingProfileListFormatter({ format: ({ outputFormat }) => outputFormat })}
        {...useMappingProfilesProperties(customProperties)}
      />
      <Route
        path={`${match.path}/view/:id`}
        render={props => (
          <MappingProfileDetailsRoute
            {...props}
            onCancel={() => history.push(`${match.path}${location.search}`)}
          />
        )}
      />
      <Route
        path={`${match.path}/edit/:id`}
        component={EditMappingProfileRoute}
      />
      <Route
        path={`${match.path}/create`}
        render={props => (
          <NewMappingProfileFormRoute
            {...props}
            initialValues={initialValues}
            onCancel={() => history.push(`${match.path}${location.search}`)}
            onSubmit={mutator.mappingProfiles.POST}
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
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.shape({ mappingProfiles: PropTypes.shape({ POST: PropTypes.func.isRequired }) }).isRequired,
};

MappingProfilesContainer.manifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  mappingProfiles: {
    type: 'okapi',
    path: 'data-export/mapping-profiles',
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

export default MappingProfilesContainer;
