import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  match as matchShape,
  history as historyShape,
  location as locationShape,
} from 'react-router-prop-types';

import { Route } from '@folio/stripes/core';
import {
  JobProfiles,
  getJobProfilesColumnProperties,
  DEFAULT_JOB_PROFILES_COLUMNS,
  getJobProfilesItemFormatter,
} from '@folio/stripes-data-transfer-components';

import { NewJobProfileRoute } from '../NewJobProfileRoute';
import { JobProfileDetailsRoute } from '../JobProfileDetailsRoute';
import { jobProfilesManifest } from '../../../common';

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

const formatter = getJobProfilesItemFormatter({ protocol: () => '' });

const JobProfilesContainer = ({
  history,
  match,
  location,
  resources,
  mutator,
  stripes,
}) => {
  const JobProfileDetailsRouteConnected = React.useMemo(() => stripes.connect(JobProfileDetailsRoute, { dataKey: 'job-profile-details' }), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <JobProfiles
        parentResources={resources}
        parentMutator={mutator}
        formatter={formatter}
        {...customProperties}
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
