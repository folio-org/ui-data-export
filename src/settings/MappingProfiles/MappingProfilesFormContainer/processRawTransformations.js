import { omit } from 'lodash';

export const parseRawTransformation = transformation => {
  // TODO: remove this check once transformations validation is done in scope of UIDEXP-187.
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
  const regex = /^(?<marcField>\d{3})(?<indicator1>[\d\s])(?<indicator2>[\d\s])(?<subfield>\$([0-9]{1,2}|[a-zA-Z]))?$/;
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
