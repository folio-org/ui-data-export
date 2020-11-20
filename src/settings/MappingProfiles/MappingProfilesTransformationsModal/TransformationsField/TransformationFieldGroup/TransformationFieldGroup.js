import React from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { TextField } from '@folio/stripes-components';

import css from './TransformationFieldGroup.css';

export const TransformationFieldGroup = ({ record }) => {
  return (
    <div
      key={record.displayName}
      className={css.fieldGroupWrap}
      data-test-transformation-field-group
    >
      <div className={css.field}>
        <Field
          component={TextField}
          name={`transformations[${record.order}].rawTransformation.marcField`}
          marginBottom0
        />
      </div>
      <div className={classNames(css.field, css.indicator)}>
        <Field
          component={TextField}
          name={`transformations[${record.order}].rawTransformation.indicator1`}
          marginBottom0
        />
      </div>
      <div className={classNames(css.field, css.indicator)}>
        <Field
          component={TextField}
          name={`transformations[${record.order}].rawTransformation.indicator2`}
          marginBottom0
        />
      </div>
      <div className={css.field}>
        <Field
          component={TextField}
          name={`transformations[${record.order}].rawTransformation.subfield`}
          marginBottom0
        />
      </div>
    </div>
  );
};

TransformationFieldGroup.propTypes = {
  record: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    displayNameKey: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    path: PropTypes.string.isRequired,
    recordType: PropTypes.string.isRequired,
    rawTransformation: PropTypes.shape({
      marcValue: PropTypes.string,
      indicator1: PropTypes.string,
      indicator2: PropTypes.string,
      subfield: PropTypes.string,
    }),
  }).isRequired,
};
