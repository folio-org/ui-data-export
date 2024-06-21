import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

export const required = value => (
  (value || value === false || value === 0) ? undefined : <FormattedMessage id="stripes-data-transfer-components.validation.enterValue" />
);

export const requiredArray = values => {
  return !isEmpty(values) ? undefined : <FormattedMessage id="stripes-data-transfer-components.validation.enterValue" />;
};

export const fieldSuppression = (value) => {
  const regex = /^\d{3}$/;

  if (!value) {
    return undefined;
  }

  const trimmedValue = value?.split(',').filter(Boolean).join(',');

  const fields = trimmedValue.split(',').map(field => field.trim());

  const isValid = fields.every(field => regex.test(field));

  return isValid
    ? undefined
    : <FormattedMessage id="ui-data-export.mappingProfiles.validation.fieldsSuppression" />;
};
