import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { JobProfilesForm } from '../JobProfilesForm';
import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';

const getFormattedMappingProfiles = (mappingProfiles = []) => {
  return mappingProfiles.reduce((memo, current) => {
    memo.push({
      label: current.name,
      value: current.id,
    });

    return memo;
  }, []);
};

const NewJobProfileRoute = props => {
  const {
    onCancel,
    onSubmit,
    resources: { mappingProfiles },
  } = props;

  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.jobProfiles.errorCallout',
    successMessageId: 'ui-data-export.jobProfiles.createdCallout',
    onAction: onSubmit,
    onCancel,
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

NewJobProfileRoute.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    mappingProfiles: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
};

NewJobProfileRoute.manifest = Object.freeze({
  mappingProfiles: {
    type: 'okapi',
    records: 'mappingProfiles',
    path: 'data-export/mappingProfiles',
    params: { limit: '10000' },
  },
});

export default stripesConnect(NewJobProfileRoute);
