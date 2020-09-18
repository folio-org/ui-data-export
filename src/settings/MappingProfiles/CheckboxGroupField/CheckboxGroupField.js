import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Field } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';

export const CheckboxGroupField = memo(({
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
              <Checkbox
                {...fieldProps.input}
                label={option.label}
                innerClass={filtersLabelClass}
                onChange={event => {
                  onChange(event, option);
                  fieldProps.input.onChange(event);
                }}
              />
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
};
