import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  get,
  orderBy,
} from 'lodash';
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
import { DuplicateMappingProfileRoute } from '../DuplicateMappingProfileRoute';

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
    () => orderBy(get(resources.transformations.records, '0.transformationFields', [])
      .map(transformation => ({
        ...transformation,
        displayName: intl.formatMessage(
          { id: `ui-data-export.${transformation.displayNameKey}` },
          { value: transformation.referenceDataValue },
        ),
      })), 'displayName', 'asc'),
    [intl, resources.transformations.records],
  );
  const isTransformationsLoaded = get(resources, 'transformations.hasLoaded', false);

  const handleNavigationToMappingProfilesList = useCallback(
    () => push(`${path}${search}`),
    [push, path, search],
  );

  const buildMappingProfileViewNavigationHandler = useCallback(
    ({
      match,
      location,
    }) => () => push(`/settings/data-export/mapping-profiles/view/${match.params.id}${location.search}`),
    [push],
  );

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
            onCancel={handleNavigationToMappingProfilesList}
          >
            <MappingProfileDetailsRoute
              {...props}
              allTransformations={allTransformations}
              onCancel={handleNavigationToMappingProfilesList}
            />
          </FullScreenPreloader>
        )}
      />
      <Route
        path={`${path}/edit/:id`}
        render={editPageProps => {
          const handleEditPageCancel = buildMappingProfileViewNavigationHandler(editPageProps);

          return (
            <FullScreenPreloader
              isLoading={!isTransformationsLoaded}
              onCancel={handleEditPageCancel}
            >
              <EditMappingProfileRoute
                {...editPageProps}
                allTransformations={allTransformations}
                onCancel={handleNavigationToMappingProfilesList}
                onSubmitNavigate={handleNavigationToMappingProfilesList}
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
            onCancel={handleNavigationToMappingProfilesList}
          >
            <CreateMappingProfileFormRoute
              {...props}
              initialValues={initialValues}
              allTransformations={allTransformations}
              onCancel={handleNavigationToMappingProfilesList}
              onSubmit={mutator.mappingProfiles.POST}
              onSubmitNavigate={handleNavigationToMappingProfilesList}
            />
          </FullScreenPreloader>
        )}
      />
      <Route
        path={`${path}/duplicate/:id`}
        render={duplicatePageProps => {
          const handleDuplicatePageCancel = buildMappingProfileViewNavigationHandler(duplicatePageProps);

          return (
            <FullScreenPreloader
              isLoading={!isTransformationsLoaded}
              onCancel={handleDuplicatePageCancel}
            >
              <DuplicateMappingProfileRoute
                {...duplicatePageProps}
                allTransformations={allTransformations}
                onCancel={handleNavigationToMappingProfilesList}
                onSubmit={mutator.mappingProfiles.POST}
                onSubmitNavigate={handleNavigationToMappingProfilesList}
              />
            </FullScreenPreloader>
          );
        }}
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
