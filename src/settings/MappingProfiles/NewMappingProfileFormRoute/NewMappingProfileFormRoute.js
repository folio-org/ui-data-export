import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { CalloutContext } from '@folio/stripes/core';

import { MappingProfilesForm } from '../MappingProfilesForm';

const NewMappingProfileFormRoute = ({
  onSubmit,
  onCancel,
}) => {
  const callout = useContext(CalloutContext);

  const handleSubmit = async values => {
    try {
      await onSubmit(values);

      callout.sendCallout({
        message: <SafeHTMLMessage
          id="ui-data-export.mappingProfiles.createdCallout"
          values={{ name: values.name }}
        />,
      });
    } finally {
      onCancel();
    }
  };

  return (
    <MappingProfilesForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

NewMappingProfileFormRoute.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default NewMappingProfileFormRoute;
