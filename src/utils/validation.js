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

  return !value || value?.split(',').every(field => regex.test(field.trim()))
    ? undefined
    : <FormattedMessage id="ui-data-export.mappingProfiles.validation.fieldsSuppression" />;
};
