import { omit } from 'lodash';

import { isInstanceTransformationEmpty } from '../MappingProfilesTransformationsModal/validateTransformations';

export const parseRawTransformation = transformation => {
  if (isInstanceTransformationEmpty(transformation)) {
    return '';
  }

  const { rawTransformation = {} } = transformation;
  const {
    marcField = '',
  } = rawTransformation;
  let {
    indicator1 = ' ',
    indicator2 = ' ',
    subfield = '',
  } = rawTransformation;

  if (indicator1 === '' || indicator1 === '\\') {
    indicator1 = ' ';
  }

  if (indicator2 === '' || indicator2 === '\\') {
    indicator2 = ' ';
  }

  if (marcField.startsWith('00')) {
    subfield = '';
  } else subfield = `$${subfield}`;

  return `${marcField}${indicator1}${indicator2}${subfield}`;
};

export const splitIntoRawTransformation = transformation => {
  if (typeof transformation !== 'string') return undefined;

  const regex = /^(?<marcField>\d{3})(?<indicator1>[\d\sa-zA-Z])(?<indicator2>[\d\sa-zA-Z])(?<subfield>\$([0-9]{1,2}|[a-zA-Z]))?$/;
  const rawTransformation = transformation.match(regex)?.groups;

  if ((rawTransformation?.indicator1 === ' ' || rawTransformation?.indicator1 === '') && !rawTransformation?.marcField.startsWith('0')) {
    rawTransformation.indicator1 = '\\';
  } else if (rawTransformation?.marcField.startsWith('00')) {
    rawTransformation.indicator1 = '';
  }

  if ((rawTransformation?.indicator2 === ' ' || rawTransformation?.indicator2 === '') && !rawTransformation?.marcField.startsWith('0')) {
    rawTransformation.indicator2 = '\\';
  } else if (rawTransformation?.marcField.startsWith('00')) {
    rawTransformation.indicator2 = '';
  }

  rawTransformation.subfield = rawTransformation.subfield?.replace('$', '');

  return rawTransformation;
};

export const omitRawTransformations = profile => {
  const transformations = profile.transformations.map(transformation => ({ ...omit(transformation, ['rawTransformation']) }));

  return {
    ...profile,
    transformations,
  };
};
