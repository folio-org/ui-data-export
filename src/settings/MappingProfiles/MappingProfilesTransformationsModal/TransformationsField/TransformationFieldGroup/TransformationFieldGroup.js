import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  TextField,
  Popover,
  IconButton,
} from '@folio/stripes-components';

import css from './TransformationFieldGroup.css';

export const TransformationFieldGroup = ({
  record,
  isTransformationInvalid = false,
  isSubmitButtonDisabled,
  setIsSubmitButtonDisabled,
}) => {
  const intl = useIntl();

  const handleChange = useCallback(() => {
    if (isSubmitButtonDisabled) {
      setIsSubmitButtonDisabled(false);
    }
  }, [isSubmitButtonDisabled, setIsSubmitButtonDisabled]);

  const renderTransformationField = ({
    name,
    testId,
    maxLength,
    isIndicator = false,
  }) => (
    <div
      className={classNames(css.field, { [css.indicator]: isIndicator })}
      data-testid={testId}
    >
      <Field
        name={name}
        render={fieldProps => (
          <TextField
            {...fieldProps.input}
            maxLength={maxLength}
            marginBottom0
            onChange={event => {
              handleChange();
              fieldProps.input.onChange(event);
            }}
          />
        )}
      />
    </div>
  );

  return (
    <div
      key={record.displayName}
      className={css.fieldGroupWrap}
      data-testid="transformation-field-group"
    >
      {renderTransformationField({
        name: `transformations[${record.order}].rawTransformation.marcField`,
        testId: 'transformation-marcField',
        maxLength: 3,
      })}
      {renderTransformationField({
        name: `transformations[${record.order}].rawTransformation.indicator1`,
        testId: 'transformation-indicator1',
        maxLength: 1,
        isIndicator: true,
      })}
      {renderTransformationField({
        name: `transformations[${record.order}].rawTransformation.indicator2`,
        testId: 'transformation-indicator2',
        maxLength: 1,
        isIndicator: true,
      })}
      {renderTransformationField({
        name: `transformations[${record.order}].rawTransformation.subfield`,
        testId: 'transformation-subfield',
        maxLength: 3,
      })}
      {isTransformationInvalid && (
        <Popover
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
          {intl.formatMessage({ id: 'ui-data-export.mappingProfiles.transformations.invalidTransformationMessage' })}
        </Popover>
      )}
    </div>
  );
};

TransformationFieldGroup.propTypes = {
  record: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
  }).isRequired,
  isTransformationInvalid: PropTypes.bool,
  isSubmitButtonDisabled: PropTypes.bool.isRequired,
  setIsSubmitButtonDisabled: PropTypes.func.isRequired,
};
