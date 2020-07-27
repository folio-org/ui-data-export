import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  match as matchShape,
  history as historyShape,
  location as locationShape,
} from 'react-router-prop-types';

import { Route } from '@folio/stripes/core';
import {
  JobProfiles,
  useJobProfilesProperties,
  DEFAULT_JOB_PROFILES_COLUMNS,
  useListFormatter,
} from '@folio/stripes-data-transfer-components';

import { NewJobProfileRoute } from '../NewJobProfileRoute';
import { JobProfileDetailsRoute } from '../JobProfileDetailsRoute';
import { jobProfilesManifest } from '../../../common';

const customProperties = {
  columnWidths: { protocol: '70px' },
  columnMapping: { protocol: 'ui-data-export.protocol' },
  visibleColumns: [
    DEFAULT_JOB_PROFILES_COLUMNS.NAME,
    'protocol',
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED,
    DEFAULT_JOB_PROFILES_COLUMNS.UPDATED_BY,
  ],
};

const JobProfilesContainer = ({
  history,
  match,
  location,
  resources,
  mutator,
  stripes,
}) => {
  const JobProfileDetailsRouteConnected = useMemo(
    () => stripes.connect(JobProfileDetailsRoute, { dataKey: 'job-profile-details' }),
    [stripes],
  );

  return (
    <>
      <JobProfiles
        parentResources={resources}
        parentMutator={mutator}
        formatter={useListFormatter({ protocol: () => '' })}
        {...useJobProfilesProperties(customProperties)}
      />
      <Route
        path={`${match.path}/view/:id`}
        component={JobProfileDetailsRouteConnected}
      />
      <Route
        path={`${match.path}/create`}
        render={() => (
          <NewJobProfileRoute
            onSubmit={mutator.jobProfiles.POST}
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
  stripes: PropTypes.shape({ connect: PropTypes.func.isRequired }).isRequired,
};

JobProfilesContainer.manifest = Object.freeze(jobProfilesManifest);

export default JobProfilesContainer;
