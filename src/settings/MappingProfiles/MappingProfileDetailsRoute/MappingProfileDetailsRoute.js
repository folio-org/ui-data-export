import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  find,
} from 'lodash';

import { stripesConnect, TitleManager } from '@folio/stripes/core';

import { useIntl } from 'react-intl';
import { MappingProfileDetails } from '../MappingProfileDetails';
import { buildShouldRefreshHandler } from '../../../utils';
import { mappingProfileShape } from '../shapes';

const MappingProfileDetailsRoute = ({
  resources: {
    mappingProfile,
  },
  allTransformations,
  mutator: { mappingProfile: { DELETE } },
  history,
  match: { params },
  location,
  onCancel,
}) => {
  // `find` is used to make sure the matched mapping profile is displayed to avoid
  // the flickering because of the disappearing of the previous and appearing of the new ones
  // TODO: try `useManifest` hook once it is ready to avoid that
  const mappingProfileRecord = find([get(mappingProfile, 'records.0', {})], { id: params.id });
  const isDefaultProfile = mappingProfileRecord?.default;
  const intl = useIntl();

  return (
    <TitleManager page={intl.formatMessage({ id:'ui-data-export.settings.job.manager' }, { job: mappingProfileRecord?.name })}>
      <MappingProfileDetails
        allTransformations={allTransformations}
        mappingProfile={mappingProfileRecord}
        isDefaultProfile={isDefaultProfile}
        isLoading={!mappingProfileRecord}
        onEdit={() => history.push(`/settings/data-export/mapping-profiles/edit/${params.id}${location.search}`)}
        onDuplicate={() => history.push(`/settings/data-export/mapping-profiles/duplicate/${params.id}${location.search}`)}
        onCancel={onCancel}
        onDelete={() => DELETE({ id: mappingProfileRecord?.id })}
      />
    </TitleManager>
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
});

export default stripesConnect(MappingProfileDetailsRoute);
