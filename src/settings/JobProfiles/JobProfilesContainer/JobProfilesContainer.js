import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { match as matchShape } from 'react-router-prop-types';

import {
  Route, useStripes,
} from '@folio/stripes/core';
import {
  JobProfiles,
  useJobProfilesProperties,
  DEFAULT_JOB_PROFILES_COLUMNS,
  useListFormatter,
} from '@folio/stripes-data-transfer-components';

import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { CreateJobProfileRoute } from '../CreateJobProfileRoute';
import { JobProfileDetailsRoute } from '../JobProfileDetailsRoute';
import { jobProfilesManifest } from '../../../common';
import { EditJobProfileRoute } from '../EditJobProfileRoute';
import { DuplicateJobProfileRoute } from '../DuplicateJobProfileRoute';

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
  match,
  resources,
  mutator,
}) => {
  const history = useHistory();
  const location = useLocation();
  const stripes = useStripes();

  const JobProfileDetailsRouteConnected = useMemo(
    () => stripes.connect(JobProfileDetailsRoute, { dataKey: 'job-profile-details' }),
    [stripes]
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
          <CreateJobProfileRoute
            onSubmit={mutator.jobProfiles?.POST}
            onCancel={() => history.push(`${match.path}${location.search}`)}
          />
        )}
      />
      <Route
        path={`${match.path}/edit/:id`}
        render={props => (
          <EditJobProfileRoute
            onSubmit={mutator.jobProfiles.PUT}
            onCancel={() => history.push(`${match.path}${location.search}`)}
            {...props}
          />
        )}
      />
      <Route
        path={`${match.path}/duplicate/:id`}
        render={props => (
          <DuplicateJobProfileRoute
            onSubmit={mutator.jobProfiles.POST}
            onCancel={() => history.push(`${match.path}${location.search}`)}
            {...props}
          />
        )}
      />
    </>
  );
};

JobProfilesContainer.propTypes = {
  match: matchShape.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

JobProfilesContainer.manifest = Object.freeze(jobProfilesManifest);

export default JobProfilesContainer;
