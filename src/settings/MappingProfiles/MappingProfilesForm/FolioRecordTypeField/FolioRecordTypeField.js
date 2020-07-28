import React, {
  memo,
  useState,
  useCallback,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Label } from '@folio/stripes/components';

import { RecordTypeField } from '../../RecordTypeField';

import css from './FolioRecordTypeField.css';

export const FolioRecordTypeField = memo(() => {
  const [touched, setTouched] = useState(false);

  const handleRecordTypeChange = useCallback(() => setTouched(true), []);

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
      <RecordTypeField
        id="folio-record-type"
        name="recordTypes"
        onChange={handleRecordTypeChange}
      />
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
});
