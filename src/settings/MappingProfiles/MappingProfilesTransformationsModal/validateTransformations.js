import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

const transformationRegexMap = {
  marcField: /^\d{3}$/,
  indicator: /^[\d\sa-zA-Z\\]?$/,
  subfield: /^([0-9]{1,2}|[a-zA-Z])$/,
  controlledSubfield: /^([0-9]{1,2}|[a-zA-Z])?/,
};

export const checkTransformationValidity = ({
  marcField,
  indicator1,
  indicator2,
  subfield,
}) => ({
  marcField,
  indicator1,
  indicator2,
  subfield,
  isTransformationValid: marcField && indicator1 && indicator2 && subfield,
});

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


export const isInstanceTransformationEmpty = transformation => {
  if (transformation.recordType === FOLIO_RECORD_TYPES.INSTANCE.type) {
    if (isRawTransformationEmpty(transformation.rawTransformation)) {
      return true;
    }
  }

  return false;
};

export const validateRawTransformation = transformation => {
  if (isInstanceTransformationEmpty(transformation)) {
    return { isTransformationValid: true };
  }

  const { rawTransformation = {} } = transformation;
  const {
    marcField = '',
    indicator1 = '',
    indicator2 = '',
    subfield = '',
  } = rawTransformation;

  return checkTransformationValidity({
    marcField: transformationRegexMap.marcField.test(marcField),
    indicator1: transformationRegexMap.indicator.test(indicator1),
    indicator2: transformationRegexMap.indicator.test(indicator2),
    subfield: marcField.startsWith('0') ? transformationRegexMap.controlledSubfield.test(subfield) : transformationRegexMap.subfield.test(subfield),
  });
};

export const validateTransformations = transformations => {
  const modifiedTransformations = transformations.filter(transformation => !isRawTransformationEmpty(transformation.rawTransformation) || transformation.isSelected);
  const invalidTransformations = {};

  modifiedTransformations.forEach(transformation => {
    const validatedFields = validateRawTransformation(transformation);

    if (!validatedFields.isTransformationValid) {
      invalidTransformations[transformation.order] = validatedFields;
    }
  });

  return invalidTransformations;
};
