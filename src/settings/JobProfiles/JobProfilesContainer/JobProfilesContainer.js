import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { match as matchShape } from 'react-router-prop-types';

import {
  Route, TitleManager, useStripes,
} from '@folio/stripes/core';
import {
  JobProfiles,
  useJobProfilesProperties,
  DEFAULT_JOB_PROFILES_COLUMNS,
  useListFormatter
} from '@folio/stripes-data-transfer-components';

import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useIntl } from 'react-intl';
import { CreateJobProfileRoute } from '../CreateJobProfileRoute';
import { JobProfileDetailsRoute } from '../JobProfileDetailsRoute';
import { jobProfilesManifest } from '../../../common';
import { EditJobProfileRoute } from '../EditJobProfileRoute';
import { DuplicateJobProfileRoute } from '../DuplicateJobProfileRoute';

const customProperties = {
  visibleColumns: [
    DEFAULT_JOB_PROFILES_COLUMNS.NAME,
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
  const intl = useIntl();
  const hasOnlyViewPerms = stripes.hasPerm('settings.data-export.view') && !stripes.hasPerm('ui-data-export.settings.enabled');
  const lastMenu = hasOnlyViewPerms ? (<></>) : '';

  const JobProfileDetailsRouteConnected = useMemo(
    () => stripes.connect(JobProfileDetailsRoute, { dataKey: 'job-profile-details' }),
    [stripes]
  );


  return (
    <>
      <TitleManager page={intl.formatMessage({ id:'ui-data-export.jobProfilesTitle.manager' })}>
        <JobProfiles
          parentResources={resources}
          parentMutator={mutator}
          formatter={useListFormatter({ format: ({ outputFormat }) => outputFormat })}
          {...useJobProfilesProperties(customProperties)}
          lastMenu={lastMenu}
        />
      </TitleManager>
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
