import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  Headline,
  KeyValue,
  Layer,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FullScreenView,
  Preloader,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';
import { JobProfileDetailsActionMenu } from '../JobProfileDetailsActionMenu';

const JobProfileDetails = props => {
  const {
    jobProfile,
    mappingProfile,
    isLoading,
    stripes,
    isProfileUsed,
    isDefaultProfile,
    onCancel,
  } = props;

  const renderActionMenu = useCallback(({ onToggle }) => {
    return (
      <JobProfileDetailsActionMenu
        isProfileUsed={isProfileUsed}
        isDefaultProfile={isDefaultProfile}
        onToggle={onToggle}
      />
    );
  }, [isProfileUsed, isDefaultProfile]);

  return (
    <FormattedMessage id="ui-data-export.mappingProfiles.newProfile">
      {contentLabel => (
        <Layer
          isOpen
          contentLabel={contentLabel}
        >
          <FullScreenView
            id="job-profile-details"
            paneTitle={jobProfile?.name && <SettingsLabel iconKey="jobProfiles">{jobProfile.name}</SettingsLabel>}
            actionMenu={!isLoading && renderActionMenu}
            onCancel={onCancel}
          >
            {isLoading
              ? <Preloader />
              : (
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
              )
            }
          </FullScreenView>
        </Layer>
      )}
    </FormattedMessage>
  );
};

JobProfileDetails.propTypes = {
  isProfileUsed: PropTypes.bool.isRequired,
  isDefaultProfile: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  mappingProfile: PropTypes.object,
  jobProfile: PropTypes.object,
  stripes: PropTypes.object,
  isLoading: PropTypes.bool,
};

JobProfileDetails.defaultProps = { isLoading: false };

export default JobProfileDetails;
