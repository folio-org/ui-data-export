import React, {
  memo,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  InfoPopover,
  Label,
} from '@folio/stripes/components';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import {
  RECORD_TYPES,
  DISABLING_CHECKBOX_MAPPING,
} from '../../../../utils';
import { CheckboxGroupField } from '../../CheckboxGroupField';

import css from './FolioRecordTypeField.css';

export const FolioRecordTypeField = memo(({
  initiallyDisabledRecord,
  onTypeDisable,
}) => {
  const [touched, setTouched] = useState(false);
  const [disabledTypes, setDisabledTypes] = useState({
    [FOLIO_RECORD_TYPES.SRS.type]: false,
    [FOLIO_RECORD_TYPES.INSTANCE.type]: false,
    ...initiallyDisabledRecord,
  });

  const handleRecordTypeChange = useCallback(({ target: { checked } }, { value }) => {
    setTouched(true);

    if (disabledTypes[value] !== undefined) {
      setDisabledTypes({
        ...disabledTypes,
        [DISABLING_CHECKBOX_MAPPING[value]]: checked,
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
        options={[{
          value: FOLIO_RECORD_TYPES.SRS.type,
          label: <FormattedMessage id={FOLIO_RECORD_TYPES.SRS.captionId} />,
          endAdornment: <InfoPopover
            content={<SafeHTMLMessage id="ui-data-export.mappingProfiles.srs.info" />}
            iconSize="medium"
          />,
        }, ...RECORD_TYPES]}
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
  initiallyDisabledRecord: PropTypes.object.isRequired,
  onTypeDisable: PropTypes.func.isRequired
};

FolioRecordTypeField.defaultProps = {
  initiallyDisabledRecord: {}
}
