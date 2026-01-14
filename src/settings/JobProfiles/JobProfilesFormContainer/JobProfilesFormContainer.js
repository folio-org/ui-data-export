import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { useStripes } from '@folio/stripes/core';
import {
  Col, Headline, Row,
} from '@folio/stripes/components';
import { JobProfilesForm } from '../JobProfilesForm';
import { formatJobProfileFormInitialValues } from '../../MappingProfiles/utils/formatJobProfileFormInitialValues';

const JobProfilesFormContainer = ({
  mode = 'newProfile',
  hasLoaded,
  mappingProfiles,
  onCancel,
  onSubmit,
  jobProfile,
}) => {
  const stripes = useStripes();
  const intl = useIntl();
  const hasLockPermissions = stripes.hasPerm('ui-data-export.settings.lock.edit');

  const getModeBasedProps = () => {
    switch (mode) {
      case 'newProfile':
        return {
          paneTitle: intl.formatMessage({ id: 'ui-data-export.jobProfiles.newProfile' }),
          initialValues: {
            locked: hasLockPermissions,
          }
        };
      case 'editProfile':
        return {
          paneTitle: intl.formatMessage({ id: 'ui-data-export.jobProfiles.editProfile' }, { name: jobProfile?.name }),
          initialValues: formatJobProfileFormInitialValues(jobProfile),
          metadata: (
            <ViewMetaData
              metadata={jobProfile.metadata}
              stripes={stripes}
            />
          ),
          headLine: (
            <Row>
              <Col xs={12}>
                <Headline
                  data-test-headline
                  size="x-large"
                  tag="h2"
                  margin="small"
                >
                  {jobProfile.name}
                </Headline>
              </Col>
            </Row>
          ),
        };
      case 'duplicateProfile':
        return {
          paneTitle: intl.formatMessage({ id: 'ui-data-export.jobProfiles.newProfile' }),
          initialValues: {
            ...formatJobProfileFormInitialValues(jobProfile, ['id']),
            locked: false,
            name: intl.formatMessage(
              { id: 'ui-data-export.copyOf' },
              { value: jobProfile.name }
            ),
          },
        };
      default:
        return {};
    }
  };

  return (
    <JobProfilesForm
      hasLoaded={hasLoaded}
      mappingProfiles={mappingProfiles}
      hasLockPermissions={hasLockPermissions}
      onSubmit={onSubmit}
      onCancel={onCancel}
      {...getModeBasedProps()}
    />
  );
};

JobProfilesFormContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  mappingProfiles: PropTypes.arrayOf(PropTypes.object),
  jobProfile: PropTypes.object,
  hasLoaded: PropTypes.bool,
  mode: PropTypes.oneOf(['newProfile', 'editProfile', 'duplicateProfile']),
};

export default JobProfilesFormContainer;
