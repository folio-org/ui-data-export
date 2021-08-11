import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  find,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { MappingProfileDetails } from '../MappingProfileDetails';
import {
  DEFAULT_MAPPING_PROFILE_ID,
  buildShouldRefreshHandler,
} from '../../../utils';
import { mappingProfileShape } from '../shapes';

const MappingProfileDetailsRoute = ({
  resources: {
    mappingProfile,
    jobProfiles,
  },
  allTransformations,
  mutator: { mappingProfile: { DELETE } },
  history,
  match: { params },
  location,
  onCancel,
}) => {
  // `find` is used to make sure the matched job profile, mapping profile are displayed to avoid
  // the flickering because of the disappearing of the previous and appearing of the new ones
  // TODO: try `useManifest` hook once it is ready to avoid that
  const mappingProfileRecord = find([get(mappingProfile, 'records.0', {})], { id: params.id });
  const isProfileUsed = Boolean(find([get(jobProfiles, 'records.0', {})], { mappingProfileId: params.id }));
  const isDefaultProfile = mappingProfileRecord?.id === DEFAULT_MAPPING_PROFILE_ID;

  return (
    <MappingProfileDetails
      allTransformations={allTransformations}
      mappingProfile={mappingProfileRecord}
      isProfileUsed={isProfileUsed}
      isDefaultProfile={isDefaultProfile}
      isLoading={!mappingProfileRecord || (!isDefaultProfile && !jobProfiles.hasLoaded)}
      onEdit={() => history.push(`/settings/data-export/mapping-profiles/edit/${params.id}${location.search}`)}
      onDuplicate={() => history.push(`/settings/data-export/mapping-profiles/duplicate/${params.id}${location.search}`)}
      onCancel={onCancel}
      onDelete={() => DELETE({ id: mappingProfileRecord?.id })}
    />
  );
};

MappingProfileDetailsRoute.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  allTransformations: PropTypes.arrayOf(PropTypes.object),
  onCancel: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    mappingProfile: PropTypes.shape({ records: PropTypes.arrayOf(mappingProfileShape) }),
    jobProfiles: PropTypes.shape({ hasLoaded: PropTypes.bool }),
  }),
  mutator: PropTypes.shape({ mappingProfile: PropTypes.shape({ DELETE: PropTypes.func.isRequired }).isRequired }).isRequired,
};

const resourceActionsToPreventRefresh = { mappingProfile: ['DELETE'] };

MappingProfileDetailsRoute.manifest = Object.freeze({
  mappingProfile: {
    type: 'okapi',
    path: 'data-export/mapping-profiles/:{id}',
    shouldRefresh: buildShouldRefreshHandler(resourceActionsToPreventRefresh),
  },
  jobProfiles: {
    type: 'okapi',
    records: 'jobProfiles',
    path: (queryParams, pathComponents) => {
      const { id } = pathComponents;

      return id !== DEFAULT_MAPPING_PROFILE_ID ? `data-export/job-profiles?query=mappingProfileId==${id}&limit=1` : null;
    },
    shouldRefresh: buildShouldRefreshHandler(resourceActionsToPreventRefresh),
  },
});

export default stripesConnect(MappingProfileDetailsRoute);
