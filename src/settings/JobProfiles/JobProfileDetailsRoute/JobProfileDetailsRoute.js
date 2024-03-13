import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import { TitleManager, useOkapiKy } from '@folio/stripes/core';

import { useIntl } from 'react-intl';
import { JobProfileDetails } from '../JobProfileDetails';

const JobProfileDetailsRoute = ({
  mutator: { jobProfile: { DELETE } },
  history,
  location,
  match,
}) => {
  const ky = useOkapiKy();
  const intl = useIntl();

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
    <TitleManager page={intl.formatMessage({ id:'ui-data-export.settings.job.manager' }, { job: jobProfileRecord?.name })}>
      <JobProfileDetails
        jobProfile={jobProfileRecord}
        mappingProfile={mappingProfileRecord}
        isProfileUsed={Boolean(jobExecutionsQuery.data?.totalRecords)}
        isDefaultProfile={isDefaultProfile}
        isLoading={!jobProfileRecord || !mappingProfileRecord || (!isDefaultProfile && jobExecutionsQuery.isLoading)}
        onCancel={handleCancel}
        onEdit={() => { history.push(`/settings/data-export/job-profiles/edit/${match.params.id}${location.search}`); }}
        onDuplicate={() => { history.push(`/settings/data-export/job-profiles/duplicate/${match.params.id}${location.search}`); }}
        onDelete={() => DELETE({ id: jobProfileRecord?.id })}
      />
    </TitleManager>
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
