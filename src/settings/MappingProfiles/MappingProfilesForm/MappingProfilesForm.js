import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { noop } from 'lodash';
import { Field } from 'react-final-form';

import {
  Accordion,
  AccordionSet,
  Col,
  AccordionStatus,
  ExpandAllButton,
  Row,
  Select,
  Layer,
  TextField,
  TextArea,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FullScreenForm } from '@folio/stripes-data-transfer-components';

import { FolioRecordTypeField } from './FolioRecordTypeField/FolioRecordTypeField';
import { TransformationField } from './TransformationsField';
import {
  required,
  requiredArray,
} from '../../../utils';

import css from './MappingProfilesForm.css';

const validate = values => {
  const errors = {};

  errors.name = required(values.name);
  errors.folioRecordTypeError = requiredArray(values.recordTypes);
  errors.outputFormat = required(values.outputFormat);

  return errors;
};

const MappingProfilesForm = props => {
  const {
    onCancel,
    handleSubmit,
    pristine,
    submitting,
  } = props;

  const intl = useIntl();

  return (
    <FormattedMessage id="ui-data-export.mappingProfiles.newProfile">
      {contentLabel => (
        <Layer
          isOpen
          contentLabel={contentLabel}
        >
          <FullScreenForm
            id="mapping-profiles-form"
            paneTitle={<FormattedMessage id="ui-data-export.mappingProfiles.newProfile" />}
            isSubmitButtonDisabled={pristine || submitting}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          >
            <div className={css.mappingProfilesFormContent}>
              <AccordionStatus>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton />
                  </Col>
                </Row>
                <AccordionSet id="mapping-profiles-form-accordions">
                  <Accordion label={<FormattedMessage id="ui-data-export.summary" />}>
                    <div data-test-mapping-profile-form-name>
                      <Field
                        label={<FormattedMessage id="stripes-data-transfer-components.name" />}
                        name="name"
                        id="mapping-profile-name"
                        component={TextField}
                        fullWidth
                        required
                      />
                    </div>
                    <FolioRecordTypeField />
                    <div data-test-mapping-profile-output-format>
                      <Field
                        label={<FormattedMessage id="ui-data-export.outputFormat" />}
                        name="outputFormat"
                        id="mapping-profile-output-format"
                        component={Select}
                        dataOptions={[{
                          label: intl.formatMessage({ id: 'ui-data-export.marc' }),
                          value: 'MARC',
                        }]}
                        fullWidth
                        required
                      />
                    </div>
                    <div data-test-mapping-profile-description>
                      <Field
                        label={<FormattedMessage id="ui-data-export.description" />}
                        name="description"
                        id="mapping-profile-description"
                        component={TextArea}
                        fullWidth
                      />
                    </div>
                  </Accordion>
                  <Accordion label={<FormattedMessage id="ui-data-export.transformations" />}>
                    <TransformationField />
                  </Accordion>
                </AccordionSet>
              </AccordionStatus>
            </div>
          </FullScreenForm>
        </Layer>
      )}
    </FormattedMessage>
  );
};

MappingProfilesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

MappingProfilesForm.defaultProps = { onCancel: noop };

export default stripesFinalForm({
  validate,
  subscription: { values: true },
})(MappingProfilesForm);
