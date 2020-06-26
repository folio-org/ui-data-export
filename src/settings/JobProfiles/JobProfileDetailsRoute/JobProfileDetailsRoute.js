import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  find,
} from 'lodash';

import { JobProfileDetails } from '../JobProfileDetails';

const JobProfileDetailsRoute = ({
  resources: {
    jobProfile,
    mappingProfile,
  },
  history,
  location,
  match,
}) => {
  // `find` is used to make sure the matched job profile and mapping profile are displayed to avoid
  // the flickering because of the disappearing of the previous and appearing of the new ones
  const jobProfileRecord = find([get(jobProfile, 'records.0', {})], { id: match.params.id });
  const mappingProfileRecord = find([get(mappingProfile, 'records.0', {})], { id: jobProfileRecord?.mappingProfileId });

  return (
    <JobProfileDetails
      jobProfile={jobProfileRecord}
      mappingProfile={mappingProfileRecord}
      isLoading={!jobProfileRecord || !mappingProfileRecord}
      onCancel={() => history.push(`/settings/data-export/job-profiles${location.search}`)}
    />
  );
};

JobProfileDetailsRoute.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
  resources: PropTypes.shape({
    jobProfile: PropTypes.shape({}),
    mappingProfile: PropTypes.shape({}),
  }).isRequired,
};

JobProfileDetailsRoute.manifest = Object.freeze({
  jobProfile: {
    type: 'okapi',
    path: 'data-export/jobProfiles/:{id}',
    throwErrors: false,
  },
  mappingProfile: {
    type: 'okapi',
    path: (queryParams, pathComponents, resourceData, logger, props) => {
      const mappingProfileId = get(props.resources, 'jobProfile.records.0.mappingProfileId');

      return mappingProfileId ? `data-export/mappingProfiles/${mappingProfileId}` : null;
    },
  },
});

export default JobProfileDetailsRoute;
