import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect, TitleManager } from '@folio/stripes/core';

import { useIntl } from 'react-intl';
import JobProfilesFormContainer from '../JobProfilesFormContainer/JobProfilesFormContainer';
import { FullScreenPreloader } from '../../../components/FullScreenPreloader';
import { getFormattedMappingProfiles } from '../../MappingProfiles/utils/mappingProfiles';
import { useJobProfileData } from '../../utils/useJobProfileData';

const DuplicateJobProfileRouteComponent = ({
  onCancel,
  onSubmit,
  resources: { mappingProfiles },
  match,
}) => {
  const {
    jobProfileRecord, handleSubmit,
  } = useJobProfileData({
    errorMessageId: 'ui-data-export.jobProfiles.duplicate.errorCallout',
    successMessageId: 'ui-data-export.jobProfiles.duplicate.successCallout',
    onCancel,
    onSubmit,
    match,
  });

  const intl = useIntl();

  if (!jobProfileRecord) {
    return (
      <FullScreenPreloader
        isLoading
        onCancel={onCancel}
      />
    );
  }

  return (
    <TitleManager page={intl.formatMessage({ id:'ui-data-export.settings.newJob.manager' })}>
      <JobProfilesFormContainer
        hasLoaded={mappingProfiles?.hasLoaded && jobProfileRecord}
        mappingProfiles={getFormattedMappingProfiles(mappingProfiles?.records)}
        jobProfile={jobProfileRecord}
        mode="duplicateProfile"
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </TitleManager>
  );
};

DuplicateJobProfileRouteComponent.propTypes = {
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

DuplicateJobProfileRouteComponent.manifest = Object.freeze({
  mappingProfiles: {
    type: 'okapi',
    records: 'mappingProfiles',
    path: 'data-export/mapping-profiles',
    params: { limit: '10000' },
  },
});

export const DuplicateJobProfileRoute = stripesConnect(DuplicateJobProfileRouteComponent);
