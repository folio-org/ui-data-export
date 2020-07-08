import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  Headline,
  KeyValue,
  Layer,
  List,
  MultiColumnList,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FOLIO_RECORD_TYPES,
  FullScreenView,
  Preloader,
} from '@folio/stripes-data-transfer-components';

import { ProfileDetailsActionMenu } from '../../../components/ProfileDetailsActionMenu';
import { mappingProfileTransformations } from '../MappingProfilesForm/TransformationsField/transformations';

import css from './MappingProfileDetails.css';
import { mappingProfileShape } from '../shapes';

const columnWidths = {
  fieldName: '45%',
  transformation: '55%',
};
const visibleColumns = ['fieldName', 'transformation'];
const formatter = {
  fieldName: record => mappingProfileTransformations.find(({ path }) => path === record.path).displayName,
  transformation: record => record.transformation,
};

const MappingProfileDetails = props => {
  const {
    mappingProfile,
    isLoading,
    stripes,
    isProfileUsed,
    isDefaultProfile,
    onCancel,
  } = props;

  const renderActionMenu = useCallback(({ onToggle }) => {
    return (
      <ProfileDetailsActionMenu
        isDefaultProfile={isDefaultProfile}
        isProfileUsed={isProfileUsed}
        onToggle={onToggle}
      />
    );
  }, [isDefaultProfile, isProfileUsed]);

  const intl = useIntl();

  const columnMapping = {
    fieldName: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.fieldName' }),
    transformation: intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.transformation' }),
  };

  return (
    <FormattedMessage id="ui-data-export.mappingProfiles.newProfile">
      {contentLabel => (
        <Layer
          isOpen
          contentLabel={contentLabel}
        >
          <FullScreenView
            id="mapping-profile-details"
            paneTitle={mappingProfile?.name}
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
                        {mappingProfile.name}
                      </Headline>
                    </Col>
                    <Col xs={3}>
                      <Row end="xs">
                        <Col xs>
                          <ExpandAllButton />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <AccordionSet id="mapping-profile-details-accordions">
                    <Accordion label={<FormattedMessage id="ui-data-export.summary" />}>
                      <ViewMetaData
                        metadata={mappingProfile.metadata}
                        stripes={stripes}
                      />
                      <Row>
                        <Col xs>
                          <KeyValue
                            data-test-mapping-profile-name
                            label={<FormattedMessage id="ui-data-export.name" />}
                            value={mappingProfile.name}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs>
                          <KeyValue
                            data-test-mapping-profile-folio-record-type
                            label={<FormattedMessage id="stripes-data-transfer-components.folioRecordType" />}
                          >
                            <List
                              items={mappingProfile.recordTypes}
                              itemFormatter={recordType => (
                                <FormattedMessage
                                  key={recordType}
                                  id={FOLIO_RECORD_TYPES[recordType].captionId}
                                  tagName="li"
                                />
                              )}
                              isEmptyMessage={<NoValue />}
                              listClass={css.recordTypesList}
                            />
                          </KeyValue>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs>
                          <KeyValue
                            data-test-mapping-profile-output-format
                            label={<FormattedMessage id="ui-data-export.outputFormat" />}
                            value={mappingProfile.outputFormat}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs>
                          <KeyValue
                            data-test-mapping-profile-description
                            label={<FormattedMessage id="ui-data-export.description" />}
                            value={mappingProfile.description || <NoValue />}
                          />
                        </Col>
                      </Row>
                    </Accordion>
                    <Accordion label={<FormattedMessage id="ui-data-export.transformations" />}>
                      <MultiColumnList
                        id="mapping-profile-details-transformations"
                        contentData={mappingProfile.transformations}
                        columnMapping={columnMapping}
                        columnWidths={columnWidths}
                        visibleColumns={visibleColumns}
                        formatter={formatter}
                        isEmptyMessage={<FormattedMessage id="ui-data-export.mappingProfiles.transformations.emptyMessage" />}
                      />
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

MappingProfileDetails.propTypes = {
  isProfileUsed: PropTypes.bool.isRequired,
  isDefaultProfile: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  mappingProfile: mappingProfileShape,
  isLoading: PropTypes.bool,
  stripes: PropTypes.object,
};

MappingProfileDetails.defaultProps = { isLoading: false };

export default MappingProfileDetails;
