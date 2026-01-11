import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Checkbox,
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
    isLoading = false,
    jobProfile,
    mappingProfile,
    stripes,
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
                    data-test-job-profile-description
                    label={<FormattedMessage id="ui-data-export.description" />}
                    value={jobProfile.description || <NoValue />}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs>
                  <Checkbox
                    data-test-job-profile-locked
                    label={<FormattedMessage id="ui-data-export.locked" />}
                    vertical
                    checked={jobProfile.locked}
                    disabled
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

export default JobProfileDetails;
