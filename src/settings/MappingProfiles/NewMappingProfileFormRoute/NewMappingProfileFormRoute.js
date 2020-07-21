import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import { MappingProfilesFormContainer } from '../MappingProfilesFormContainer';
import { normalizeTransformationFormValues } from '../MappingProfilesTransformationsModal/TransformationsField';

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
      onSubmit={values => {
        const mappingProfile = { ...omit(values, 'transformations') };

        mappingProfile.transformations = normalizeTransformationFormValues(values.transformations);
        handleSubmit(mappingProfile);
      }}
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
