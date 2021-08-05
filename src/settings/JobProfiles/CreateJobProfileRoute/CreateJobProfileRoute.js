import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { JobProfilesForm } from '../JobProfilesForm';
import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';

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

const CreateJobProfileRouteComponent = props => {
  const {
    onCancel,
    onSubmit,
    resources: { mappingProfiles },
  } = props;

  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.jobProfiles.create.errorCallout',
    successMessageId: 'ui-data-export.jobProfiles.create.successCallout',
    onAction: onSubmit,
    onActionComplete: onCancel,
  });

  return (
    <JobProfilesForm
      hasLoaded={mappingProfiles?.hasLoaded}
      mappingProfiles={getFormattedMappingProfiles(mappingProfiles?.records)}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

CreateJobProfileRouteComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    mappingProfiles: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
};

CreateJobProfileRouteComponent.manifest = Object.freeze({
  mappingProfiles: {
    type: 'okapi',
    records: 'mappingProfiles',
    path: 'data-export/mapping-profiles',
    params: { limit: '10000' },
  },
});

export const CreateJobProfileRoute = stripesConnect(CreateJobProfileRouteComponent);
