import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { JobProfilesForm } from '../JobProfilesForm';
import { useSubmitProfile } from '../../utils/useSubmitProfile';

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

  const handleSubmit = useSubmitProfile({
    errorMessageId: 'ui-data-export.jobProfiles.errorCallout',
    successMessageId: 'ui-data-export.jobProfiles.createdCallout',
    onCancel,
    onSubmit,
  });

  return (
    <JobProfilesForm
      onSubmit={handleSubmit}
      hasLoaded={mappingProfiles?.hasLoaded}
      mappingProfiles={getFormattedMappingProfiles(mappingProfiles?.records)}
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
