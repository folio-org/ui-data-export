import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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

  const getModeBasedProps = () => {
    switch (mode) {
      case 'newProfile':
        return { paneTitle: <FormattedMessage id="ui-data-export.jobProfiles.newProfile" /> };
      case 'editProfile':
        return {
          disableProtocol: true,
          paneTitle: (
            <FormattedMessage
              id="ui-data-export.jobProfiles.editProfile"
              values={{ name: jobProfile?.name }}
            />
          ),
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
      default:
        return {};
    }
  };

  return (
    <JobProfilesForm
      hasLoaded={hasLoaded}
      mappingProfiles={mappingProfiles}
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
  mode: PropTypes.oneOf(['newProfile', 'editProfile']),
};

export default JobProfilesFormContainer;
