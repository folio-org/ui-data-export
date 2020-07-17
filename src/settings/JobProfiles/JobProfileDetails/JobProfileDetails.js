import React, {
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  ConfirmationModal,
  Headline,
  KeyValue,
  Layer,
  NoValue,
  Row,
} from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FullScreenView,
  Preloader,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';

import { ProfileDetailsActionMenu } from '../../../components/ProfileDetailsActionMenu';
import { useProfileHandlerWithCallout } from '../../utils/useProfileHandlerWithCallout';

const JobProfileDetails = props => {
  const {
    jobProfile,
    mappingProfile,
    isLoading,
    stripes,
    isProfileUsed,
    isDefaultProfile,
    onCancel,
    onDelete,
  } = props;
  const [isConfirmationModalOpen, setConfirmationModalState] = useState(false);

  const handleDelete = useProfileHandlerWithCallout({
    errorMessageId: 'ui-data-export.jobProfiles.delete.errorCallout',
    successMessageId: 'ui-data-export.jobProfiles.delete.successCallout',
    onAction: onDelete,
    onCancel: () => {
      setConfirmationModalState(false);

      onCancel();
    },
    isCanceledAfterError: true,
  });

  const renderActionMenu = useCallback(({ onToggle }) => {
    return (
      <ProfileDetailsActionMenu
        isDefaultProfile={isDefaultProfile}
        isProfileUsed={isProfileUsed}
        onToggle={onToggle}
        onDelete={() => setConfirmationModalState(true)}
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
                <>
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
                  <ConfirmationModal
                    id="delete-job-profile-confirmation-modal"
                    open={isConfirmationModalOpen}
                    heading={<FormattedMessage id="ui-data-export.jobProfiles.delete.confirmationModal.title" />}
                    message={(
                      <SafeHTMLMessage
                        id="ui-data-export.jobProfiles.delete.confirmationModal.message"
                        values={{ name: jobProfile.name }}
                      />
                    )}
                    confirmLabel={<FormattedMessage id="ui-data-export.delete" />}
                    cancelLabel={<FormattedMessage id="ui-data-export.cancel" />}
                    onCancel={() => setConfirmationModalState(false)}
                    onConfirm={() => handleDelete(jobProfile)}
                  />
                </>
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
  mappingProfile: PropTypes.object,
  jobProfile: PropTypes.object,
  stripes: PropTypes.object,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

JobProfileDetails.defaultProps = { isLoading: false };

export default JobProfileDetails;
