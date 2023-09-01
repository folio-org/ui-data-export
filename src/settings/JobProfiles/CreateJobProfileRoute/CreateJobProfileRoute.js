import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect, TitleManager } from '@folio/stripes/core';

import { useIntl } from 'react-intl';
import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';
import JobProfilesFormContainer from '../JobProfilesFormContainer/JobProfilesFormContainer';
import { getFormattedMappingProfiles } from '../../MappingProfiles/utils/mappingProfiles';

const CreateJobProfileRouteComponent = props => {
  const {
    onCancel,
    onSubmit,
    resources: { mappingProfiles },
  } = props;

  const handleSubmit = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.jobProfiles.create.errorCallout',
    successMessageId: 'ui-data-export.jobProfiles.create.successCallout',
    onAction: onSubmit,
    onActionComplete: onCancel,
  });

  const intl = useIntl();

  return (
    <TitleManager page={intl.formatMessage({ id:'ui-data-export.settings.newJob.manager' })}>
      <JobProfilesFormContainer
        hasLoaded={mappingProfiles?.hasLoaded}
        mappingProfiles={getFormattedMappingProfiles(mappingProfiles?.records)}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </TitleManager>
  );
};

CreateJobProfileRouteComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    mappingProfiles: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
};

CreateJobProfileRouteComponent.manifest = Object.freeze({
  mappingProfiles: {
    type: 'okapi',
    records: 'mappingProfiles',
    path: 'data-export/mapping-profiles',
    params: { limit: '10000' },
  },
});

export const CreateJobProfileRoute = stripesConnect(CreateJobProfileRouteComponent);
