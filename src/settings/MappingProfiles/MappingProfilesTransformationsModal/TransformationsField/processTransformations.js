import { omit } from 'lodash';

export function generateTransformationFieldsValues(transformations) {
  return transformations.map((transformation, i) => ({
    fieldId: transformation.id,
    path: transformation.path,
    recordType: transformation.recordType,
    displayName: transformation.displayName,
    order: i,
  }));
}

export function normalizeTransformationFormValues(transformations) {
  return transformations
    .map(transformation => ({
      ...omit(transformation, 'displayName', 'order'),
      enabled: Boolean(transformation.transformation),
    }))
    .filter(transformation => Boolean(transformation.transformation));
}
