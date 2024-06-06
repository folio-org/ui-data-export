import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Field } from 'react-final-form';

import {
  Checkbox,
  Layout,
} from '@folio/stripes/components';

export const CheckboxGroupField = memo(({
  disabledFields = {},
  id,
  name,
  options,
  filtersLabelClass,
  onChange,
}) => {
  return (
    <div id={id}>
      {options.map(option => (
        <div key={option.value}>
          <Field
            name={name}
            type="checkbox"
            value={option.value}
            isEqual={isEqual}
            render={fieldProps => (
              <Layout className="display-flex">
                <Checkbox
                  {...fieldProps.input}
                  label={option.label}
                  innerClass={filtersLabelClass}
                  disabled={disabledFields[option.value]}
                  onChange={event => {
                    onChange(event, option);
                    fieldProps.input.onChange(event);
                  }}
                />
                {option.details}
              </Layout>
            )}
          />
        </div>
      ))}
    </div>
  );
});

CheckboxGroupField.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  filtersLabelClass: PropTypes.string,
  disabledFields: PropTypes.object,
};
