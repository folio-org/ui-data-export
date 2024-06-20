import React, { useEffect, useState } from 'react';
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
  Checkbox,
  InfoPopover,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FOLIO_RECORD_TYPES, FullScreenForm } from '@folio/stripes-data-transfer-components';

import { FolioRecordTypeField } from './FolioRecordTypeField/FolioRecordTypeField';
import { TransformationsList } from '../TransformationsList';
import {
  fieldSuppression,
  required,
  requiredArray,
} from '../../../utils';

import css from './MappingProfilesForm.css';

const validate = values => {
  const errors = {};

  errors.name = required(values.name);
  errors.outputFormat = required(values.outputFormat);
  errors.recordTypes = requiredArray(values.recordTypes);
  errors.fieldsSuppression = fieldSuppression(values.fieldsSuppression);

  return errors;
};

const MappingProfilesFormComponent = props => {
  const {
    isEditMode = false,
    isFormDirty = false,
    title = <FormattedMessage id="ui-data-export.mappingProfiles.newProfile" />,
    pristine,
    submitting,
    transformations,
    allTransformations,
    form,
    initiallyDisabledRecordTypes,
    onAddTransformations,
    handleSubmit,
    onCancel,
    onTypeDisable,
  } = props;
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const openTransformationModalButtonId = isEditMode ? 'editTransformations' : 'addTransformations';
  const isSubmitButtonDisabled = isFormDirty ? !isFormDirty : pristine || submitting;
  const recordTypes = form.getFieldState('recordTypes')?.value;
  const isFieldsSuppressionDisabled = !recordTypes?.length || recordTypes?.every(recordType => [FOLIO_RECORD_TYPES.ITEM.type].includes(recordType));
  const fieldSuppressionFieldLabel = (
    <>
      <FormattedMessage id="ui-data-export.fieldsSuppression" />
      <span onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <InfoPopover
          allowAnchorClick
          open={open}
          content={<FormattedMessage id="ui-data-export.suppressInfo" />}
        />
      </span>
    </>
  );

  // it's required clear field value when it became disabled
  useEffect(() => {
    if (isFieldsSuppressionDisabled && form.getFieldState('fieldsSuppression')?.value) {
      form.change('fieldsSuppression', '');
    }
  }, [form, isFieldsSuppressionDisabled]);

  const handleSubmitValidated = (value) => {
    const supress = form.getFieldState('fieldsSuppression')?.value;
    form.change('fieldsSuppression', supress?.replace(/,+$/, ''));

    handleSubmit(value);
  };

  useEffect(() => {
    const transformationsField = form.getFieldState('transformations');
    if (transformationsField) {
      transformationsField.change(transformations);
    }
  }, [form, transformations]);

  return (
    <FullScreenForm
      id="mapping-profiles-form"
      paneTitle={title}
      isSubmitButtonDisabled={isSubmitButtonDisabled}
      onSubmit={handleSubmitValidated}
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
              <div data-test-mapping-profile-fieldsSuppression>
                <Field
                  disabled={isFieldsSuppressionDisabled}
                  label={fieldSuppressionFieldLabel}
                  name="fieldsSuppression"
                  id="mapping-profile-fieldsSuppression"
                  component={TextArea}
                  fullWidth
                />
              </div>
              <div data-test-mapping-profile-suppress999ff>
                <Field
                  type="checkbox"
                  label={<FormattedMessage id="ui-data-export.suppress999ff" />}
                  name="suppress999ff"
                  id="mapping-profile-suppress999ff"
                  component={Checkbox}
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

export const MappingProfilesForm = stripesFinalForm({
  validate,
  subscription: { values: true },
  navigationCheck: true,
})(MappingProfilesFormComponent);
