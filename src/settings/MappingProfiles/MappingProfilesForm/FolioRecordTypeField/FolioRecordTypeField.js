import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { isEqual } from 'lodash';
import { Field } from 'react-final-form';

import {
  Label,
  Checkbox,
} from '@folio/stripes/components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import css from './FolioRecordTypeField.css';

const folioRecordTypes = [
  {
    value: FOLIO_RECORD_TYPES.INSTANCE.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.INSTANCE.captionId} />,
  },
  {
    value: FOLIO_RECORD_TYPES.HOLDINGS.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.HOLDINGS.captionId} />,
  },
  {
    value: FOLIO_RECORD_TYPES.ITEMS.type,
    label: <FormattedMessage id={FOLIO_RECORD_TYPES.ITEMS.captionId} />,
  },
];

export const FolioRecordTypeField = () => {
  const [touched, setTouched] = useState(false);

  return (
    <div
      className={css.folioRecordTypeContainer}
      data-test-folio-record-type
    >
      <Label
        htmlFor="folio-record-type"
        required
        data-test-folio-record-type-label
      >
        <FormattedMessage id="stripes-data-transfer-components.folioRecordType" />
      </Label>
      <div
        id="folio-record-type"
        data-test-checkboxes-container
      >
        {folioRecordTypes.map(option => (
          <div key={option.value}>
            <Field
              name="recordTypes"
              id={`folio-record-type-${option.value}`}
              type="checkbox"
              value={option.value}
              isEqual={isEqual}
              initialValue={[]}
              render={fieldProps => {
                return (
                  <Checkbox
                    {...fieldProps.input}
                    label={option.label}
                    onChange={event => {
                      setTouched(true);
                      fieldProps.input.onChange(event);
                    }}
                  />
                );
              }}
            />
          </div>
        ))}
      </div>
      <div
        role="alert"
        data-test-folio-record-type-error
      >
        <Field
          name="folioRecordTypeError"
          component={({ meta }) => {
            return (touched || meta.touched) && meta.error ? <span className={css.error}>{meta.error}</span> : null;
          }}
        />
      </div>
    </div>
  );
};
