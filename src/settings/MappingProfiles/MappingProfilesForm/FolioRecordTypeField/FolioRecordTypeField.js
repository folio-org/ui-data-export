import React, {
  memo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import { Label } from '@folio/stripes/components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { RECORD_TYPES } from './utils/constants';
import { RECORD_TYPES_DISABLING_MAPPING } from '../../../../utils';
import { CheckboxGroupField } from '../../CheckboxGroupField';

import css from './FolioRecordTypeField.css';

export const FolioRecordTypeField = memo(({
  initiallyDisabledTypes,
  onTypeDisable,
}) => {
  const [touched, setTouched] = useState(false);
  const [disabledTypes, setDisabledTypes] = useState({
    [FOLIO_RECORD_TYPES.SRS.type]: false,
    [FOLIO_RECORD_TYPES.INSTANCE.type]: false,
    ...initiallyDisabledTypes,
  });

  const handleRecordTypeChange = useCallback(({ target: { checked } }, { value }) => {
    setTouched(true);

    const isFieldCanBeDisabled = disabledTypes[value] !== undefined;

    if (isFieldCanBeDisabled) {
      setDisabledTypes({
        ...disabledTypes,
        [RECORD_TYPES_DISABLING_MAPPING[value]]: checked,
      });
    }
  }, [disabledTypes]);

  useEffect(() => {
    onTypeDisable(disabledTypes);
  }, [disabledTypes, onTypeDisable]);

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
      <CheckboxGroupField
        id="folio-record-type"
        name="recordTypes"
        options={RECORD_TYPES}
        disabledFields={disabledTypes}
        onChange={handleRecordTypeChange}
      />
      <div
        role="alert"
        data-test-folio-record-type-error
      >
        <Field
          name="recordTypes"
          component={({ meta }) => {
            if ((touched || meta.touched) && meta.error) {
              return <span className={css.error}>{meta.error}</span>;
            }
            if (meta.submitError) {
              return <span className={css.error}>{meta.submitError}</span>;
            }

            return null;
          }}
        />
      </div>
    </div>
  );
});

FolioRecordTypeField.propTypes = {
  initiallyDisabledTypes: PropTypes.object,
  onTypeDisable: PropTypes.func.isRequired,
};

FolioRecordTypeField.defaultProps = { initiallyDisabledTypes: {} };
