import React from 'react';
import PropTypes from 'prop-types';

import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import { MappingProfilesFormContainer } from '../MappingProfilesFormContainer';

const NewMappingProfileFormRoute = ({
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.mappingProfiles.errorCallout',
    successMessageId: 'ui-data-export.mappingProfiles.createdCallout',
    onAction: onSubmit,
    onCancel,
  });

  return (
    <MappingProfilesFormContainer
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

NewMappingProfileFormRoute.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default NewMappingProfileFormRoute;
