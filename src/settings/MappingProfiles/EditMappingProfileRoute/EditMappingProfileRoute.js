import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import { MappingProfilesFormContainer } from '../MappingProfilesFormContainer';
import { FullScreenPreloader } from '../../../components/FullScreenPreloader';
import { formatMappingProfileFormInitialValues } from '../utils';

export const EditMappingProfileRouteComponent = ({
  resources: { mappingProfile },
  mutator,
  allTransformations,
  onCancel,
  onSubmitNavigate,
}) => {
  const intl = useIntl();
  const contentLabel = intl.formatMessage({ id: 'ui-data-export.mappingProfiles.editProfile' });

  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.mappingProfiles.edit.errorCallout',
    successMessageId: 'ui-data-export.mappingProfiles.edit.successCallout',
    isCanceledAfterError: true,
    onAction: mutator.mappingProfile.PUT,
    onActionComplete: onSubmitNavigate,
  });

  const mappingProfileRecord = get(mappingProfile, 'records.0');

  if (!mappingProfileRecord) {
    return (
      <FullScreenPreloader
        isLoading
        contentLabel={contentLabel}
        onCancel={onCancel}
      />
    );
  }

  return (
    <MappingProfilesFormContainer
      isEditMode
      allTransformations={allTransformations}
      contentLabel={contentLabel}
      title={mappingProfileRecord.name}
      initialValues={formatMappingProfileFormInitialValues(mappingProfileRecord)}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

EditMappingProfileRouteComponent.manifest = Object.freeze({
  mappingProfile: {
    type: 'okapi',
    path: 'data-export/mapping-profiles/:{id}',
    PUT: { throwErrors: false },
  },
});

EditMappingProfileRouteComponent.propTypes = {
  resources: PropTypes.shape({ mappingProfile: PropTypes.object }).isRequired,
  mutator: PropTypes.shape({ mappingProfile: PropTypes.shape({ PUT: PropTypes.func.isRequired }) }).isRequired,
  allTransformations: PropTypes.arrayOf(PropTypes.object),
  onCancel: PropTypes.func.isRequired,
  onSubmitNavigate: PropTypes.func.isRequired,
};

export const EditMappingProfileRoute = stripesConnect(EditMappingProfileRouteComponent);
