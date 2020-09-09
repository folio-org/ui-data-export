import { omit } from 'lodash';

export function generateTransformationFieldsValues(allTransformations, profileTransformations = []) {
  const generatedTransformations = allTransformations.map((transformation, i) => ({
    ...transformation,
    order: i,
  }));

  profileTransformations.forEach(profileTransformation => {
    const profileTransformationInAllTransformations = generatedTransformations
      .find(transformation => transformation.fieldId === profileTransformation.fieldId);

    if (profileTransformationInAllTransformations) {
      profileTransformationInAllTransformations.isSelected = Boolean(profileTransformation.enabled);

      if (profileTransformation.transformation) {
        profileTransformationInAllTransformations.transformation = profileTransformation.transformation;
      }
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

export function updateTransformationsWithSelected(allTransformations = [], selectedTransformations = []) {
  const newAllTransformations = [...allTransformations];

  selectedTransformations.forEach(selectedTransformation => {
    const transformationIndex = newAllTransformations.findIndex(transformation => transformation.fieldId === selectedTransformation.fieldId);

    newAllTransformations[transformationIndex] = {
      ...newAllTransformations[transformationIndex],
      transformation: selectedTransformation.transformation,
      isSelected: true,
    };
  });

  return newAllTransformations;
}
