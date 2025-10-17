import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import { MappingProfilesFormContainer } from '../MappingProfilesFormContainer';

export const CreateMappingProfileFormRoute = ({
  allTransformations,
  initialValues,
  metadata,
  isFormDirty,
  onSubmit,
  onCancel,
  onSubmitNavigate,
  isDuplicate = false,
}) => {
  const intl = useIntl();
  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.mappingProfiles.create.errorCallout',
    successMessageId: 'ui-data-export.mappingProfiles.create.successCallout',
    onAction: onSubmit,
    onActionComplete: onSubmitNavigate,
  });

  const titleManagerLabel =
    initialValues.name && !isDuplicate
      ? intl.formatMessage({ id: 'ui-data-export.settings.job.manager' }, { job: initialValues?.name })
      : intl.formatMessage({ id: 'ui-data-export.settings.newMapping.manager' });

  return (
    <TitleManager page={titleManagerLabel}>
      <MappingProfilesFormContainer
        metadata={metadata}
        allTransformations={allTransformations}
        initialValues={initialValues}
        isFormDirty={isFormDirty}
        contentLabel={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.newProfile' })}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </TitleManager>
  );
};

CreateMappingProfileFormRoute.propTypes = {
  metadata: PropTypes.shape({}),
  allTransformations: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object.isRequired,
  isFormDirty: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSubmitNavigate: PropTypes.func.isRequired,
  isDuplicate: PropTypes.bool,
};
