import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import JobProfilesFormContainer from '../JobProfilesFormContainer/JobProfilesFormContainer';
import { FullScreenPreloader } from '../../../components/FullScreenPreloader';
import { getFormattedMappingProfiles } from '../../MappingProfiles/utils/mappingProfiles';
import { useJobProfileData } from '../../utils/useJobProfileData';

const EditJobProfileRouteComponent = ({
  onCancel,
  onSubmit,
  resources: { mappingProfiles },
  match,
}) => {
  const {
    jobProfileRecord, handleSubmit,
  } = useJobProfileData({
    errorMessageId: 'ui-data-export.jobProfiles.edit.errorCallout',
    successMessageId: 'ui-data-export.jobProfiles.edit.successCallout',
    onCancel,
    onSubmit,
    match,
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
