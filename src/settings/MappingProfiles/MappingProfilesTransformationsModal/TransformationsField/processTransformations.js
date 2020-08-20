import { omit } from 'lodash';

export function generateTransformationFieldsValues(allTransformations, profileTransformations = []) {
  let profileTransformationsIndex = 0;

  return allTransformations.map((transformation, i) => {
    const field = {
      fieldId: transformation.id,
      path: transformation.path,
      recordType: transformation.recordType,
      displayName: transformation.displayName,
      order: i,
    };

    if (profileTransformationsIndex === profileTransformations.length) {
      return field;
    }

    const profileTransformation = profileTransformations[profileTransformationsIndex];

    if (transformation.path === profileTransformation.path) {
      field.transformation = profileTransformation.transformation;
      field.isSelected = profileTransformation.enabled;
      profileTransformationsIndex++;
    }

    return field;
  });
}

export function normalizeTransformationFormValues(transformations) {
  return transformations
    .filter(transformation => Boolean(transformation?.isSelected))
    .map(transformation => ({
      ...omit(transformation, ['isSelected', 'order', 'displayName']),
      enabled: true,
    }));
}
