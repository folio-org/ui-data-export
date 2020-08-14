import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import { MappingProfilesFormContainer } from '../MappingProfilesFormContainer';

const NewMappingProfileFormRoute = ({
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const intl = useIntl();
  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.mappingProfiles.create.errorCallout',
    successMessageId: 'ui-data-export.mappingProfiles.create.successCallout',
    onAction: onSubmit,
    onCancel,
  });

  return (
    <MappingProfilesFormContainer
      contentLabel={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.newProfile' })}
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
