import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import { isEqual } from 'lodash';

import {
  Accordion,
  AccordionSet,
  Col,
  AccordionStatus,
  ExpandAllButton,
  Row,
  Select,
  TextField,
  TextArea,
  Button,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FullScreenForm } from '@folio/stripes-data-transfer-components';

import { FolioRecordTypeField } from './FolioRecordTypeField/FolioRecordTypeField';
import { TransformationsList } from '../TransformationsList';
import {
  required,
  requiredArray,
} from '../../../utils';

import css from './MappingProfilesForm.css';

const validate = values => {
  const errors = {};

  errors.name = required(values.name);
  errors.outputFormat = required(values.outputFormat);
  errors.recordTypes = requiredArray(values.recordTypes);

  return errors;
};

const MappingProfilesFormComponent = props => {
  const {
    title,
    pristine,
    submitting,
    transformations,
    allTransformations,
    isEditMode,
    isFormDirty,
    form,
    initiallyDisabledRecordTypes,
    onAddTransformations,
    handleSubmit,
    onCancel,
    onTypeDisable,
  } = props;
  const intl = useIntl();

  const openTransformationModalButtonId = isEditMode ? 'editTransformations' : 'addTransformations';
  const isSubmitButtonDisabled = isFormDirty ? !isFormDirty : pristine || submitting;

  useEffect(() => {
    if (form.getFieldState('transformations')) {
      form.getFieldState('transformations').change(transformations);
    }
  }, [form, transformations]);

  return (
    <FullScreenForm
      id="mapping-profiles-form"
      paneTitle={title}
      isSubmitButtonDisabled={isSubmitButtonDisabled}
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
              <FolioRecordTypeField
                initiallyDisabledRecordTypes={initiallyDisabledRecordTypes}
                onTypeDisable={onTypeDisable}
              />
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
            <Accordion
              label={<FormattedMessage id="ui-data-export.transformations" />}
              displayWhenOpen={(
                <Button
                  data-test-add-transformations
                  marginBottom0
                  onClick={onAddTransformations}
                >
                  <FormattedMessage id={`ui-data-export.mappingProfiles.transformations.${openTransformationModalButtonId}`} />
                </Button>
              )}
            >
              <Field
                name="transformations"
                id="mapping-profile-transformations"
                isEqual={isEqual}
              >
                {({ input }) => (
                  <TransformationsList
                    name={input.name}
                    transformations={transformations}
                    allTransformations={allTransformations}
                  />
                )}
              </Field>
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
      </div>
    </FullScreenForm>
  );
};

MappingProfilesFormComponent.propTypes = {
  transformations: PropTypes.arrayOf(PropTypes.object),
  allTransformations: PropTypes.arrayOf(PropTypes.object).isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.node,
  isEditMode: PropTypes.bool,
  isFormDirty: PropTypes.bool,
  form: PropTypes.object.isRequired,
  initiallyDisabledRecordTypes: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onAddTransformations: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onTypeDisable: PropTypes.func.isRequired,
};

MappingProfilesFormComponent.defaultProps = {
  isEditMode: false,
  isFormDirty: false,
  title: <FormattedMessage id="ui-data-export.mappingProfiles.newProfile" />,
};

export const MappingProfilesForm = stripesFinalForm({
  validate,
  subscription: { values: false },
  navigationCheck: true,
})(MappingProfilesFormComponent);
