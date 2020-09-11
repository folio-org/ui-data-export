import { omit } from 'lodash';

export function generateTransformationFieldsValues(allTransformations, profileTransformations = []) {
  const generatedTransformations = allTransformations.map((transformation, i) => ({
    ...transformation,
    order: i,
  }));

  profileTransformations.forEach(profileTransformation => {
    const profileTransformationInAllTransformationsIndex = generatedTransformations
      .findIndex(transformation => transformation.fieldId === profileTransformation.fieldId);
    const profileTransformationInAllTransformations = Object.assign({}, generatedTransformations[profileTransformationInAllTransformationsIndex]);

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
      enabled: true,
    }));
}

export function generateSelectedTransformations(transformations, predicate) {
  return transformations.reduce((result, transformation) => {
    const matchedTransformation = predicate(transformation);

    if (matchedTransformation) {
      result[matchedTransformation.order] = true;
    }

    return result;
  }, {});
}
