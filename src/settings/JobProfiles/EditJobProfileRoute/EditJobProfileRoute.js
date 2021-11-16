import React from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect, useOkapiKy,
} from '@folio/stripes/core';

import { useQuery } from 'react-query';
import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import JobProfilesFormContainer from '../JobProfilesFormContainer/JobProfilesFormContainer';
import { FullScreenPreloader } from '../../../components/FullScreenPreloader';

const getFormattedMappingProfiles = (mappingProfiles = []) => (
  mappingProfiles
    .map(profile => (
      {
        label: profile.name,
        value: profile.id,
      }
    ))
    .sort((a, b) => a.label.localeCompare(b.label))
);

const EditJobProfileRouteComponent = ({
  onCancel,
  onSubmit,
  resources: { mappingProfiles },
  match,
}) => {
  const ky = useOkapiKy();

  const { data: jobProfileRecord } = useQuery(
    ['data-export', 'job-profile', match.params.id],
    () => ky(`data-export/job-profiles/${match.params.id}`).json()
  );

  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.jobProfiles.edit.errorCallout',
    successMessageId: 'ui-data-export.jobProfiles.edit.successCallout',
    onAction: onSubmit,
    onActionComplete: onCancel,
    isCanceledAfterError: true,
  });

  if (!jobProfileRecord) {
    return (
      <FullScreenPreloader
        isLoading
        onCancel={onCancel}
      />
    );
  }

  return (
    <JobProfilesFormContainer
      hasLoaded={mappingProfiles?.hasLoaded && jobProfileRecord}
      mappingProfiles={getFormattedMappingProfiles(mappingProfiles?.records)}
      jobProfile={jobProfileRecord}
      mode="editProfile"
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

EditJobProfileRouteComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    mappingProfiles: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
};

EditJobProfileRouteComponent.manifest = Object.freeze({
  mappingProfiles: {
    type: 'okapi',
    records: 'mappingProfiles',
    path: 'data-export/mapping-profiles',
    params: { limit: '10000' },
  },
});

export const EditJobProfileRoute = stripesConnect(EditJobProfileRouteComponent);
