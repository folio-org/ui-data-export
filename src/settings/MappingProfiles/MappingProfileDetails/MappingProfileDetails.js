import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { noop } from 'lodash';

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
  MetaSection,
  MultiColumnList,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  FOLIO_RECORD_TYPES,
  FullScreenView,
  Preloader,
} from '@folio/stripes-data-transfer-components';

import { mappingProfileTransformations } from '../MappingProfilesForm/TransformationsField/transformations';
import { mappingProfilesShape } from '../shapes';

import css from './MappingProfileDetails.css';

const columnWidths = {
  fieldName: '45%',
  transformation: '55%',
};
const visibleColumns = ['fieldName', 'transformation'];
const formatter = {
  fieldName: record => mappingProfileTransformations.find(({ id }) => id === record.fieldId).displayName,
  transformation: record => record.transformation,
};

const MappingProfileDetails = props => {
  const {
    onCancel,
    mappingProfile: {
      hasLoaded,
      records,
    },
  } = props;

  const record = records?.[0] || {};

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
            paneTitle={record.name}
            onCancel={onCancel}
          >
            {!hasLoaded
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
                        {record.name}
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
                      <MetaSection
                        createdBy={record.metadata.createdByUserId}
                        lastUpdatedBy={record.metadata.updatedByUserId}
                        createdDate={record.metadata.createdDate}
                        lastUpdatedDate={record.metadata.updatedDate}
                      />
                      <Row>
                        <Col xs>
                          <KeyValue
                            data-test-mapping-profile-name
                            label={<FormattedMessage id="ui-data-export.name" />}
                            value={record.name}
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
                              items={record.recordTypes}
                              itemFormatter={recordType => (
                                <FormattedMessage
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
                            value={record.outputFormat}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col xs>
                          <KeyValue
                            data-test-mapping-profile-description
                            label={<FormattedMessage id="ui-data-export.description" />}
                            value={record.description || <NoValue />}
                          />
                        </Col>
                      </Row>
                    </Accordion>
                    <Accordion label={<FormattedMessage id="ui-data-export.transformations" />}>
                      <MultiColumnList
                        id="mapping-profile-details-transformations"
                        contentData={record.transformations}
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
  onCancel: PropTypes.func,
  mappingProfile: mappingProfilesShape,
};

MappingProfileDetails.defaultProps = {
  onCancel: noop,
  mappingProfile: {
    hasLoaded: false,
    records: [],
  },
};

export default MappingProfileDetails;
