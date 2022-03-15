import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { get } from 'lodash';

import { FullScreenPreloader } from '../../../components/FullScreenPreloader';

import { CreateMappingProfileFormRoute } from '../CreateMappingProfileFormRoute';
import { formatMappingProfileFormInitialValues } from '../utils';

export const DuplicateMappingProfileRouteComponent = ({
  resources: { mappingProfile },
  allTransformations,
  onCancel,
  onSubmit,
  onSubmitNavigate,
}) => {
  const intl = useIntl();
  const mappingProfileRecord = get(mappingProfile, 'records.0');

  if (!mappingProfileRecord) {
    return (
      <FullScreenPreloader
        isLoading
        contentLabel={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.newProfile' })}
        onCancel={onCancel}
      />
    );
  }

  const newMappingProfileRecord = {
    ...mappingProfileRecord,
    default: false,
    name: intl.formatMessage(
      { id: 'ui-data-export.copyOf' },
      { value: mappingProfileRecord.name }
    ),
  };

  return (
    <CreateMappingProfileFormRoute
      isFormDirty
      allTransformations={allTransformations}
      initialValues={formatMappingProfileFormInitialValues(newMappingProfileRecord, ['id'])}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onSubmitNavigate={onSubmitNavigate}
    />
  );
};

DuplicateMappingProfileRouteComponent.manifest = Object.freeze({
  mappingProfile: {
    type: 'okapi',
    path: 'data-export/mapping-profiles/:{id}',
  },
});

DuplicateMappingProfileRouteComponent.propTypes = {
  allTransformations: PropTypes.arrayOf(PropTypes.object),
  resources: PropTypes.shape({ mappingProfile: PropTypes.object }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSubmitNavigate: PropTypes.func.isRequired,
};

export const DuplicateMappingProfileRoute = stripesConnect(DuplicateMappingProfileRouteComponent);
