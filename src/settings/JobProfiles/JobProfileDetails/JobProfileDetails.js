import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  Headline,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { ProfileDetails } from '../../ProfileDetails';

const JobProfileDetails = props => {
  const {
    jobProfile,
    mappingProfile,
    stripes,
    isLoading,
    onEdit,
    onDuplicate,
  } = props;

  return (
    <ProfileDetails
      profile={jobProfile}
      type="job"
      onEdit={onEdit}
      onDuplicate={onDuplicate}
      {...props}
    >
      {!isLoading && (
        <AccordionStatus>
          <Row>
            <Col xs={9}>
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
          <AccordionSet id="job-profile-details-accordions">
            <Accordion label={<FormattedMessage id="ui-data-export.summary" />}>
              <ViewMetaData
                metadata={jobProfile.metadata}
                stripes={stripes}
              />
              <Row>
                <Col xs>
                  <KeyValue
                    data-test-job-profile-name
                    label={<FormattedMessage id="ui-data-export.name" />}
                    value={jobProfile.name}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs>
                  <KeyValue
                    data-test-job-profile-mapping-profile
                    label={<FormattedMessage id="ui-data-export.mappingProfile" />}
                    value={mappingProfile.name}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs>
                  <KeyValue
                    data-test-job-profile-protocol
                    label={<FormattedMessage id="ui-data-export.protocol" />}
                    value={<NoValue />}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs>
                  <KeyValue
                    data-test-job-profile-description
                    label={<FormattedMessage id="ui-data-export.description" />}
                    value={jobProfile.description || <NoValue />}
                  />
                </Col>
              </Row>
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
      )}
    </ProfileDetails>
  );
};

JobProfileDetails.propTypes = {
  isProfileUsed: PropTypes.bool.isRequired,
  isDefaultProfile: PropTypes.bool.isRequired,
  mappingProfile: PropTypes.object,
  jobProfile: PropTypes.object,
  stripes: PropTypes.object,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDuplicate: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
};

JobProfileDetails.defaultProps = { isLoading: false };

export default JobProfileDetails;
