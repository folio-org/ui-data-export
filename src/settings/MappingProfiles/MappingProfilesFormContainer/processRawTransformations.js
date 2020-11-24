import { omit } from 'lodash';

export const parseRawTransformation = transformation => {
  // TODO: remove this check once transformations validation is in place.
  const { rawTransformation = {} } = transformation;
  const {
    marcField = '',
    indicator1 = ' ',
    indicator2 = ' ',
    subfield = '',
  } = rawTransformation;

  return `${marcField}${indicator1}${indicator2}${subfield}`;
};

export const splitIntoRawTransformation = transformation => {
  const regex = /^(?<marcField>\d{3})(?<indicator1>[\d\s])(?<indicator2>[\d\s])(?<subfield>\$([0-9]{2}|[a-zA-Z]))?$/;
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
