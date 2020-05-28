import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';
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
  JobProfiles,
  getJobProfilesColumnProperties,
  DEFAULT_JOB_PROFILES_COLUMNS,
  getJobProfilesItemFormatter,
} from '@folio/stripes-data-transfer-components';

import { NewJobProfileRoute } from '../NewJobProfileRoute';
import {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  FIND_ALL_CQL,
} from '../../../utils';

const customProperties = getJobProfilesColumnProperties({
  columnWidths: { protocol: '70px' },
  columnMapping: { protocol: <FormattedMessage id="ui-data-export.protocol" /> },
  visibleColumns: [
    DEFAULT_JOB_PROFILES_COLUMNS.NAME,
    'protocol',
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED,
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED_BY,
  ],
});

const queryTemplate = '(sortby "%{query.query}")';
const sortMap = {
  name: 'name',
  updated: 'metadata.updatedDate',
  updatedBy: 'userInfo.firstName userInfo.lastName',
};

const JobProfilesContainer = ({
  history,
  match,
  location,
  resources,
  mutator,
}) => {
  return (
    <>
      <JobProfiles
        parentResources={resources}
        parentMutator={mutator}
        formatter={getJobProfilesItemFormatter({ protocol: () => '' })}
        {...customProperties}
      />
      <Route
        path={`${match.path}/create`}
        render={() => (
          <NewJobProfileRoute
            onSubmit={noop}
            onCancel={() => history.push(`${match.path}${location.search}`)}
          />
        )}
      />
    </>
  );
};

JobProfilesContainer.propTypes = {
  match: matchShape.isRequired,
  history: historyShape.isRequired,
  location: locationShape.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

JobProfilesContainer.manifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  jobProfiles: {
    type: 'okapi',
    path: 'data-export/jobProfiles',
    records: 'jobProfiles',
    recordsRequired: '%{resultCount}',
    perRequest: RESULT_COUNT_INCREMENT,
    clientGeneratePk: true,
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

export default stripesConnect(JobProfilesContainer);
