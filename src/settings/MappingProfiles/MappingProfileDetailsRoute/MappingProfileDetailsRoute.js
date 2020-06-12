import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes-core';

import { MappingProfileDetails } from '../MappingProfileDetails';
import { mappingProfilesShape } from '../shapes';

const MappingProfileDetailsRoute = ({
  onCancel,
  resources: { mappingProfile },
}) => {
  return (
    <MappingProfileDetails
      onCancel={onCancel}
      mappingProfile={mappingProfile || {}}
    />
  );
};

MappingProfileDetailsRoute.propTypes = {
  onCancel: PropTypes.func.isRequired,
  resources: PropTypes.shape({ mappingProfile: mappingProfilesShape }),
};

MappingProfileDetailsRoute.manifest = Object.freeze({
  mappingProfile: {
    type: 'okapi',
    path: 'data-export/mappingProfiles/:{id}',
    resourceShouldRefresh: true,
    shouldRefresh: () => false,
  },
});

export default stripesConnect(MappingProfileDetailsRoute);
