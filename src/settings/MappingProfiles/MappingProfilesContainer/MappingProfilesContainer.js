import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
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
import { FullScreenPreloader } from '../../../components/FullScreenPreloader';
import { CreateMappingProfileFormRoute } from '../CreateMappingProfileFormRoute';
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
  history: { push },
  match: { path },
  location: { search },
  resources,
  mutator,
}) => {
  const intl = useIntl();
  const allTransformations = useMemo(
    () => get(resources.transformations.records, '0.transformationFields', [])
      .map(transformation => ({
        ...transformation,
        displayName: intl.formatMessage(
          { id: `ui-data-export.${transformation.displayNameKey}` },
          { value: transformation.referenceDataValue },
        ),
      })),
    [intl, resources.transformations.records],
  );
  const isTransformationsLoaded = get(resources, 'transformations.hasLoaded', false);
  const handleCancel = useCallback(() => push(`${path}${search}`), [push, path, search]);

  return (
    <>
      <MappingProfiles
        parentResources={resources}
        parentMutator={mutator}
        formatter={useMappingProfileListFormatter({ format: ({ outputFormat }) => outputFormat })}
        {...useMappingProfilesProperties(customProperties)}
      />
      <Route
        path={`${path}/view/:id`}
        render={props => (
          <FullScreenPreloader
            isLoading={!isTransformationsLoaded}
            onCancel={handleCancel}
          >
            <MappingProfileDetailsRoute
              {...props}
              allTransformations={allTransformations}
              onCancel={handleCancel}
            />
          </FullScreenPreloader>
        )}
      />
      <Route
        path={`${path}/edit/:id`}
        render={editPageProps => {
          const handleEditPageCancel = () => push(`/settings/data-export/mapping-profiles/view/${editPageProps.match.params.id}${editPageProps.location.search}`);

          return (
            <FullScreenPreloader
              isLoading={!isTransformationsLoaded}
              onCancel={handleEditPageCancel}
            >
              <EditMappingProfileRoute
                {...editPageProps}
                allTransformations={allTransformations}
                onCancel={handleEditPageCancel}
              />
            </FullScreenPreloader>
          );
        }}
      />
      <Route
        path={`${path}/create`}
        render={props => (
          <FullScreenPreloader
            isLoading={!isTransformationsLoaded}
            onCancel={handleCancel}
          >
            <CreateMappingProfileFormRoute
              {...props}
              initialValues={initialValues}
              allTransformations={allTransformations}
              onCancel={handleCancel}
              onSubmit={mutator.mappingProfiles.POST}
            />
          </FullScreenPreloader>
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
  transformations: {
    type: 'okapi',
    path: 'data-export/transformation-fields',
  },
});

export default MappingProfilesContainer;
