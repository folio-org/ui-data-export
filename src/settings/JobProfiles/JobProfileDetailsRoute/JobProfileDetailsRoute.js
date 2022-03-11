import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { JobProfileDetails } from '../JobProfileDetails';
import { DEFAULT_JOB_PROFILE_ID } from '../../../utils';

const JobProfileDetailsRoute = ({
  mutator: { jobProfile: { DELETE } },
  history,
  location,
  match,
}) => {
  const ky = useOkapiKy();

  const { data: jobProfileRecord } = useQuery(
    ['data-export', 'job-profile', match.params.id],
    () => ky(`data-export/job-profiles/${match.params.id}`).json()
  );
  const { data: mappingProfileRecord } = useQuery(
    ['data-export', 'mapping-profile', jobProfileRecord?.mappingProfileId],
    () => ky(`data-export/mapping-profiles/${jobProfileRecord?.mappingProfileId}`).json(),
    { enabled: Boolean(jobProfileRecord?.mappingProfileId) }
  );
  const jobExecutionsQuery = useQuery(
    ['data-export', 'job-executions', match.params.id],
    () => ky(`data-export/job-executions?query=jobProfileId==${match.params.id}&limit=1`).json(),
    { enabled: !jobProfileRecord?.default }
  );

  const isDefaultProfile = jobProfileRecord?.default;
  const handleCancel = useCallback(() => {
    history.push(`/settings/data-export/job-profiles${location.search}`);
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <JobProfileDetails
      jobProfile={jobProfileRecord}
      mappingProfile={mappingProfileRecord}
      isProfileUsed={Boolean(jobExecutionsQuery.data?.totalRecords)}
      isDefaultProfile={isDefaultProfile}
      isLoading={!jobProfileRecord || !mappingProfileRecord || (!isDefaultProfile && jobExecutionsQuery.isLoading)}
      onCancel={handleCancel}
      onEdit={() => { history.push(`/settings/data-export/job-profiles/edit/${match.params.id}`); }}
      onDuplicate={() => { history.push(`/settings/data-export/job-profiles/duplicate/${match.params.id}`); }}
      onDelete={() => DELETE({ id: jobProfileRecord?.id })}
    />
  );
};

JobProfileDetailsRoute.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
  mutator: PropTypes.shape({ jobProfile: PropTypes.shape({ DELETE: PropTypes.func.isRequired }).isRequired }).isRequired,
};

JobProfileDetailsRoute.manifest = Object.freeze({
  jobProfile: {
    type: 'okapi',
    path: 'data-export/job-profiles/:{id}',
    throwErrors: false,
    fetch: false,
  },
});

export default JobProfileDetailsRoute;
