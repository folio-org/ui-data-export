import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import { MappingProfilesFormContainer } from '../MappingProfilesFormContainer';

export const CreateMappingProfileFormRoute = ({
  allTransformations,
  initialValues,
  onSubmit,
  onCancel,
  onSubmitNavigate,
}) => {
  const intl = useIntl();
  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.mappingProfiles.create.errorCallout',
    successMessageId: 'ui-data-export.mappingProfiles.create.successCallout',
    onAction: onSubmit,
    onCancel: onSubmitNavigate,
  });

  return (
    <MappingProfilesFormContainer
      allTransformations={allTransformations}
      initialValues={initialValues}
      contentLabel={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.newProfile' })}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

CreateMappingProfileFormRoute.propTypes = {
  allTransformations: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSubmitNavigate: PropTypes.func.isRequired,
};
