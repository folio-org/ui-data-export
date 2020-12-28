import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

const transformationRegexMap = {
  marcField: /^\d{3}$/,
  indicator: /^[\d\sa-zA-Z]?$/,
  subfield: /^(\$([0-9]{1,2}|[a-zA-Z]))?$/,
};

export const isInstanceTransformationEmpty = transformation => {
  if (transformation.recordType === FOLIO_RECORD_TYPES.INSTANCE.type) {
    if (isRawTransformationEmpty(transformation.rawTransformation)) {
      return true;
    }
  }

  return false;
};

export const isRawTransformationEmpty = rawTransformation => {
  if (!rawTransformation) {
    return true;
  }

  const {
    marcField = '',
    indicator1 = '',
    indicator2 = '',
    subfield = '',
  } = rawTransformation;

  return `${marcField}${indicator1}${indicator2}${subfield}` === '';
};

export const validateRawTransformation = transformation => {
  if (isInstanceTransformationEmpty(transformation)) {
    return true;
  }

  if (transformation.rawTransformation) {
    const {
      rawTransformation: {
        marcField,
        indicator1 = '',
        indicator2 = '',
        subfield = '',
      },
    } = transformation;

    return (
      transformationRegexMap.marcField.test(marcField) &&
      transformationRegexMap.indicator.test(indicator1) &&
      transformationRegexMap.indicator.test(indicator2) &&
      transformationRegexMap.subfield.test(subfield)
    );
  }

  return false;
};

export const validateTransformations = transformations => {
  const modifiedTransformations = transformations.filter(transformation => !isRawTransformationEmpty(transformation.rawTransformation) || transformation.isSelected);
  const invalidTransformations = {};

  modifiedTransformations.forEach(transformation => {
    const isTransformationValid = validateRawTransformation(transformation);

    if (!isTransformationValid) {
      invalidTransformations[transformation.order] = true;
    }
  });

  return invalidTransformations;
};
