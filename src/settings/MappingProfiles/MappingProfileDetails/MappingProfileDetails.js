import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  Headline,
  KeyValue,
  List,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { ProfileDetails } from '../../ProfileDetails';
import { mappingProfileShape } from '../shapes';
import { TransformationsList } from '../TransformationsList';

import css from './MappingProfileDetails.css';

const MappingProfileDetails = props => {
  const {
    isLoading = false,
    allTransformations,
    mappingProfile,
    stripes,
    onEdit,
    onDuplicate,
  } = props;

  const suppressFieldsValues = mappingProfile?.suppress999ff ? '999 ff' : null;

  return (
    <ProfileDetails
      profile={mappingProfile}
      type="mapping"
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
              <Row>
                <Col xs>
                  <KeyValue
                    data-test-mapping-profile-description
                    label={<FormattedMessage id="ui-data-export.fieldsSuppression" />}
                    value={mappingProfile.fieldsSuppression || <NoValue />}
                  />
                  <KeyValue
                    data-test-mapping-profile-description
                    value={suppressFieldsValues || <NoValue />}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion label={<FormattedMessage id="ui-data-export.transformations" />}>
              <TransformationsList
                allTransformations={allTransformations}
                transformations={mappingProfile.transformations}
              />
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
      )}
    </ProfileDetails>
  );
};

MappingProfileDetails.propTypes = {
  allTransformations: PropTypes.arrayOf(PropTypes.object).isRequired,
  isProfileUsed: PropTypes.bool.isRequired,
  isDefaultProfile: PropTypes.bool.isRequired,
  mappingProfile: mappingProfileShape,
  isLoading: PropTypes.bool,
  stripes: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
};

export default MappingProfileDetails;
