import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  TextField,
  Popover,
  IconButton,
} from '@folio/stripes/components';

import { checkTransformationValidity } from '../../validateTransformations';

import css from './TransformationFieldGroup.css';

const GROUP_PLACEHOLDER = {
  marcField: '900',
  indicator1: '\\',
  indicator2: '\\',
  subfield: 'a',
};

export const TransformationFieldGroup = ({
  record,
  validatedTransformations = {
    marcField: true,
    indicator1: true,
    indicator2: true,
    subfield: true,
    isTransformationValid: true,
  },
  setValidatedTransformations,
  setIsSubmitButtonDisabled,
  typeOfField,
  isShowPlaceholder,
  setIsShowPlaceholder,
}) => {
  const intl = useIntl();

  const handleChange = useCallback((type, isValid) => {
    setIsSubmitButtonDisabled(isSubmitButtonDisabled => (isSubmitButtonDisabled ? false : isSubmitButtonDisabled));

    if (!isValid) {
      setValidatedTransformations(transformations => {
        return {
          ...transformations,
          [record.order]: checkTransformationValidity({
            ...transformations[record.order],
            [type]: true,
          }),
        };
      });
    }
  }, [record.order, setIsSubmitButtonDisabled, setValidatedTransformations]);

  const onChangeHandler = (event, type, isValid, fieldProps) => {
    if (record.isFirst) {
      setIsShowPlaceholder(!event.target.value);
    }
    handleChange(type, isValid);
    fieldProps.input.onChange(event);
  };

  const renderTransformationField = ({
    name,
    placeholder,
    testId,
    type,
    maxLength,
    isIndicator = false,
    isValid = true,
  }) => (
    <div
      className={classNames(css.field, {
        [css.indicator]: isIndicator,
        [css.isInvalid]: !isValid,
      })}
      data-testid={testId}
    >
      <Field
        name={name}
        render={fieldProps => (
          <TextField
            {...fieldProps.input}
            placeholder={(isShowPlaceholder && record.isFirst) ? placeholder : null}
            maxLength={maxLength}
            aria-invalid={!isValid}
            marginBottom0
            hasClearIcon={isValid}
            onChange={event => onChangeHandler(event, type, isValid, fieldProps)}
          />
        )}
      />
    </div>
  );

  const fieldConfigs = {
    marcField: {
      name: `transformations[${record.order}].rawTransformation.marcField`,
      placeholder: GROUP_PLACEHOLDER.marcField,
      testId: 'transformation-marcField',
      type: 'marcField',
      maxLength: 3,
      isValid: validatedTransformations.marcField,
    },
    indicator1: {
      name: `transformations[${record.order}].rawTransformation.indicator1`,
      placeholder: GROUP_PLACEHOLDER.indicator1,
      testId: 'transformation-indicator1',
      type: 'indicator1',
      maxLength: 1,
      isIndicator: true,
      isValid: validatedTransformations.indicator1,
    },
    indicator2: {
      name: `transformations[${record.order}].rawTransformation.indicator2`,
      placeholder: GROUP_PLACEHOLDER.indicator2,
      testId: 'transformation-indicator2',
      type: 'indicator2',
      maxLength: 1,
      isIndicator: true,
      isValid: validatedTransformations.indicator2,
    },
    subfield: {
      name: `transformations[${record.order}].rawTransformation.subfield`,
      placeholder: GROUP_PLACEHOLDER.subfield,
      testId: 'transformation-subfield',
      type: 'subfield',
      maxLength: 1,
      isValid: validatedTransformations.subfield,
    },
  };

  return (
    <div
      key={record.displayName}
      className={css.fieldGroupWrap}
      data-testid={`transformation-field-group-${typeOfField}`}
    >
      {renderTransformationField(fieldConfigs[typeOfField])}
      {!validatedTransformations[typeOfField] && (
        <Popover
          placement="bottom-end"
          renderTrigger={({
            ref,
            toggle,
          }) => (
            <IconButton
              icon="times-circle-solid"
              size="small"
              className={css.icon}
              ref={ref}
              data-testid="transformation-invalid"
              onClick={toggle}
            />
          )}
        >
          <div data-role="popover">
            {intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.invalidTransformationMessage' })}
          </div>
        </Popover>
      )}
    </div>
  );
};

TransformationFieldGroup.propTypes = {
  record: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    isFirst: PropTypes.bool,
  }).isRequired,
  validatedTransformations: PropTypes.shape({
    marcField: PropTypes.bool,
    indicator1: PropTypes.bool,
    indicator2: PropTypes.bool,
    subfield: PropTypes.bool,
    isTransformationValid: PropTypes.bool,
  }),
  setValidatedTransformations: PropTypes.func.isRequired,
  setIsSubmitButtonDisabled: PropTypes.func.isRequired,
  isShowPlaceholder: PropTypes.bool.isRequired,
  setIsShowPlaceholder: PropTypes.func.isRequired,
  typeOfField: PropTypes.oneOf(['marcField', 'indicator1', 'indicator2', 'subfield']).isRequired,
};
