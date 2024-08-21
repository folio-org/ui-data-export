import { omit } from 'lodash';

import {
  parseRawTransformation,
  splitIntoRawTransformation,
} from '../../MappingProfilesFormContainer/processRawTransformations';

const processMarcField = (data) => {
  if (!data) {
    return undefined;
  }

  const { marcField, indicator1, indicator2, subfield } = data;

  const result = { marcField };
  console.log(data);

  if ((!indicator1 || indicator1 === ' ') && !marcField.startsWith('00')) {
    result.indicator1 = '\\';
  } else result.indicator1 = indicator1;

  if ((!indicator2 || indicator2 === ' ') && !marcField.startsWith('00')) {
    result.indicator2 = '\\';
  } else result.indicator2 = indicator2;

  if (subfield) {
    result.subfield = subfield;
  }

  return result;
};

export function generateTransformationFieldsValues(allTransformations, profileTransformations = []) {
  const generatedTransformations = allTransformations.map((transformation, i) => ({
    ...transformation,
    order: i,
  }));

  profileTransformations.forEach(profileTransformation => {
    const profileTransformationInAllTransformationsIndex = generatedTransformations
      .findIndex(transformation => transformation.fieldId === profileTransformation.fieldId);
    const profileTransformationInAllTransformations = {
      ...generatedTransformations[profileTransformationInAllTransformationsIndex],
      rawTransformation: processMarcField(profileTransformation.rawTransformation) || splitIntoRawTransformation(profileTransformation.transformation),
    };

    if (profileTransformationInAllTransformationsIndex !== -1) {
      profileTransformationInAllTransformations.isSelected = Boolean(profileTransformation.enabled);

      if (profileTransformation.transformation) {
        profileTransformationInAllTransformations.transformation = profileTransformation.transformation;
      }

      generatedTransformations[profileTransformationInAllTransformationsIndex] = profileTransformationInAllTransformations;
    }
  });

  return generatedTransformations;
}

export function normalizeTransformationFormValues(transformations) {
  return transformations
    .filter(transformation => Boolean(transformation?.isSelected))
    .map(transformation => ({
      ...omit(transformation, ['isSelected', 'order', 'displayNameKey', 'referenceDataValue', 'displayName']),
      transformation: parseRawTransformation(transformation),
      enabled: true,
    }));
}

export function generateSelectedTransformations(transformations, predicate) {
  return transformations.reduce((result, transformation) => {
    const matchedTransformation = predicate(transformation);

    if (matchedTransformation) {
      result[matchedTransformation.fieldId] = true;
    }

    return result;
  }, {});
}
