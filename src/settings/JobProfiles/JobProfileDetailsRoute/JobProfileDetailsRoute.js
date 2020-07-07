import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  find,
} from 'lodash';

import { JobProfileDetails } from '../JobProfileDetails';
import { DEFAULT_JOB_PROFILE_ID } from '../../../utils';

const JobProfileDetailsRoute = ({
  resources: {
    jobProfile,
    mappingProfile,
    jobExecutions,
  },
  history,
  location,
  match,
}) => {
  // `find` is used to make sure the matched job profile, mapping profile and job executions are displayed to avoid
  // the flickering because of the disappearing of the previous and appearing of the new ones
  // TODO: try `useManifest` hook once it is ready to avoid that
  const jobProfileRecord = find([get(jobProfile, 'records.0', {})], { id: match.params.id });
  const mappingProfileRecord = find([get(mappingProfile, 'records.0', {})], { id: jobProfileRecord?.mappingProfileId });
  const isProfileUsed = Boolean(find([get(jobExecutions, 'records.0', {})], { jobProfileId: match.params.id }));

  const isDefaultProfile = jobProfileRecord?.id === DEFAULT_JOB_PROFILE_ID;
  const handleCancel = useCallback(() => {
    history.push(`/settings/data-export/job-profiles${location.search}`);
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <JobProfileDetails
      jobProfile={jobProfileRecord}
      mappingProfile={mappingProfileRecord}
      isProfileUsed={isProfileUsed}
      isDefaultProfile={isDefaultProfile}
      isLoading={!jobProfileRecord || !mappingProfileRecord || (!isDefaultProfile && !jobExecutions.hasLoaded)}
      onCancel={handleCancel}
    />
  );
};

JobProfileDetailsRoute.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
  resources: PropTypes.shape({
    jobProfile: PropTypes.shape({}),
    jobExecutions: PropTypes.shape({ hasLoaded: PropTypes.bool }),
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
  jobExecutions: {
    type: 'okapi',
    records: 'jobExecutions',
    path: (queryParams, pathComponents) => {
      const { id } = pathComponents;

      return id !== DEFAULT_JOB_PROFILE_ID ? `data-export/jobExecutions?query=jobProfileId==${id}&limit=1` : null;
    },
  },
});

export default JobProfileDetailsRoute;
