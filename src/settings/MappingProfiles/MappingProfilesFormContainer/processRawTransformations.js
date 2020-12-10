import { omit } from 'lodash';

import { isInstanceTransformationEmpty } from '../MappingProfilesTransformationsModal/validateTransformations';

export const parseRawTransformation = transformation => {
  if (isInstanceTransformationEmpty(transformation)) {
    return '';
  }

  const { rawTransformation = {} } = transformation;
  const {
    marcField = '',
    subfield = '',
  } = rawTransformation;
  let {
    indicator1 = ' ',
    indicator2 = ' ',
  } = rawTransformation;

  if (indicator1 === '') {
    indicator1 = ' ';
  }

  if (indicator2 === '') {
    indicator2 = ' ';
  }

  return `${marcField}${indicator1}${indicator2}${subfield}`;
};

export const splitIntoRawTransformation = transformation => {
  const regex = /^(?<marcField>\d{3})(?<indicator1>[\d\sa-zA-Z])(?<indicator2>[\d\sa-zA-Z])(?<subfield>\$([0-9]{1,2}|[a-zA-Z]))?$/;
  const rawTransformation = transformation.match(regex)?.groups;

  if (rawTransformation?.indicator1 === ' ') {
    rawTransformation.indicator1 = '';
  }

  if (rawTransformation?.indicator2 === ' ') {
    rawTransformation.indicator2 = '';
  }

  return rawTransformation;
};

export const omitRawTransformations = profile => {
  const transformations = profile.transformations.map(transformation => ({ ...omit(transformation, ['rawTransformation']) }));

  return {
    ...profile,
    transformations,
  };
};
