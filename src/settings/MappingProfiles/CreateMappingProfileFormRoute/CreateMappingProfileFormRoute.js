import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import { MappingProfilesFormContainer } from '../MappingProfilesFormContainer';

export const CreateMappingProfileFormRoute = ({
  allTransformations,
  initialValues,
  isFormDirty,
  onSubmit,
  onCancel,
  onSubmitNavigate,
}) => {
  const intl = useIntl();
  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.mappingProfiles.create.errorCallout',
    successMessageId: 'ui-data-export.mappingProfiles.create.successCallout',
    onAction: onSubmit,
    onActionComplete: onSubmitNavigate,
  });

  return (
    <MappingProfilesFormContainer
      allTransformations={allTransformations}
      initialValues={initialValues}
      isFormDirty={isFormDirty}
      contentLabel={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.newProfile' })}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

CreateMappingProfileFormRoute.propTypes = {
  allTransformations: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object.isRequired,
  isFormDirty: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSubmitNavigate: PropTypes.func.isRequired,
};
