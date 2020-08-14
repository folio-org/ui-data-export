import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  get,
  omit,
} from 'lodash';

import { stripesConnect } from '@folio/stripes-core';
import {
  FullScreenView,
  Preloader,
} from '@folio/stripes-data-transfer-components';

import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import { MappingProfilesFormContainer } from '../MappingProfilesFormContainer';
import { mappingProfileTransformations } from '../MappingProfilesTransformationsModal/TransformationsField/transformations';
import { generateTransformationFieldsValues } from '../MappingProfilesTransformationsModal/TransformationsField';

export const EditMappingProfileRouteComponent = ({
  resources: { mappingProfile },
  mutator,
  history,
  match: { params },
  location: { search },
}) => {
  const intl = useIntl();
  const contentLabel = intl.formatMessage({ id: 'ui-data-export.mappingProfiles.editProfile' });

  const handleCancel = useCallback(
    () => history.push(`/settings/data-export/mapping-profiles/view/${params.id}${search}`),
    [history, params.id, search],
  );

  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.mappingProfiles.edit.errorCallout',
    successMessageId: 'ui-data-export.mappingProfiles.edit.successCallout',
    isCanceledAfterError: true,
    onAction: mutator.mappingProfile.PUT,
    onCancel: handleCancel,
  });

  const mappingProfileRecord = get(mappingProfile, 'records.0');

  if (!mappingProfileRecord) {
    return (
      <FullScreenView
        contentLabel={contentLabel}
        onCancel={handleCancel}
      >
        <Preloader />
      </FullScreenView>
    );
  }

  const initialValues = {
    ...omit(mappingProfileRecord, 'userInfo', 'metadata', 'transformations'),
    transformations: generateTransformationFieldsValues(mappingProfileTransformations, mappingProfileRecord.transformations),
  };

  return (
    <MappingProfilesFormContainer
      initialTransformations={mappingProfileRecord.transformations}
      contentLabel={contentLabel}
      title={mappingProfileRecord.name}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

EditMappingProfileRouteComponent.manifest = Object.freeze({
  mappingProfile: {
    type: 'okapi',
    path: 'data-export/mappingProfiles/:{id}',
    PUT: { throwErrors: false },
  },
});

EditMappingProfileRouteComponent.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }) }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  resources: PropTypes.shape({ mappingProfile: PropTypes.object }).isRequired,
  mutator: PropTypes.shape({ mappingProfile: PropTypes.shape({ PUT: PropTypes.func.isRequired }) }).isRequired,
};

export const EditMappingProfileRoute = stripesConnect(EditMappingProfileRouteComponent);
