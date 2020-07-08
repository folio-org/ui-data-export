import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  find,
} from 'lodash';

import { stripesConnect } from '@folio/stripes-core';

import { MappingProfileDetails } from '../MappingProfileDetails';
import { DEFAULT_MAPPING_PROFILE_ID } from '../../../utils';
import { mappingProfileShape } from '../shapes';

const MappingProfileDetailsRoute = ({
  onCancel,
  resources: {
    mappingProfile,
    jobProfiles,
  },
  match,
}) => {
  // `find` is used to make sure the matched job profile, mapping profile are displayed to avoid
  // the flickering because of the disappearing of the previous and appearing of the new ones
  // TODO: try `useManifest` hook once it is ready to avoid that
  const mappingProfileRecord = find([get(mappingProfile, 'records.0', {})], { id: match.params.id });
  const isProfileUsed = Boolean(find([get(jobProfiles, 'records.0', {})], { mappingProfileId: match.params.id }));
  const isDefaultProfile = mappingProfileRecord?.id === DEFAULT_MAPPING_PROFILE_ID;

  return (
    <MappingProfileDetails
      mappingProfile={mappingProfileRecord}
      isProfileUsed={isProfileUsed}
      isDefaultProfile={isDefaultProfile}
      isLoading={!mappingProfileRecord || (!isDefaultProfile && !jobProfiles.hasLoaded)}
      onCancel={onCancel}
    />
  );
};

MappingProfileDetailsRoute.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
  onCancel: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    mappingProfile: PropTypes.shape({ records: PropTypes.arrayOf(mappingProfileShape) }),
    jobProfiles: PropTypes.shape({ hasLoaded: PropTypes.bool }),
  }),
};

MappingProfileDetailsRoute.manifest = Object.freeze({
  mappingProfile: {
    type: 'okapi',
    path: 'data-export/mappingProfiles/:{id}',
  },
  jobProfiles: {
    type: 'okapi',
    records: 'jobProfiles',
    path: (queryParams, pathComponents) => {
      const { id } = pathComponents;

      return id !== DEFAULT_MAPPING_PROFILE_ID ? `data-export/jobProfiles?query=mappingProfileId==${id}&limit=1` : null;
    },
  },
});

export default stripesConnect(MappingProfileDetailsRoute);
