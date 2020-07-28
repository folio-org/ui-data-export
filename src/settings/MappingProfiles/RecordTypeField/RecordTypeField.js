import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEqual } from 'lodash';
import { Field } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

export const recordTypes = [
  {
    value: FOLIO_RECORD_TYPES.INSTANCE.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.INSTANCE.captionId} />,
  },
  {
    value: FOLIO_RECORD_TYPES.HOLDINGS.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.HOLDINGS.captionId} />,
  },
  {
    value: FOLIO_RECORD_TYPES.ITEM.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.ITEM.captionId} />,
  },
];

export const RecordTypeField = memo(({
  id,
  name,
  filtersLabelClass,
  onChange,
}) => {
  return (
    <div
      id={id}
      data-test-record-type-fields
    >
      {recordTypes.map(option => (
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

RecordTypeField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  filtersLabelClass: PropTypes.string,
};
