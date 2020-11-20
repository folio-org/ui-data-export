import { omit } from 'lodash';

export const parseRawTransformation = transformations => {
  transformations.forEach(transformation => {
    const {
      rawTransformation: {
        marcField = '',
        indicator1 = ' ',
        indicator2 = ' ',
        subfield = '',
      },
    } = transformation;

    transformation.transformation = `${marcField}${indicator1}${indicator2}${subfield}`;
  });

  return transformations;
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

export const omitRawTransformations = profileData => {
  const transformations = profileData.transformations.map(transformation => ({ ...omit(transformation, ['rawTransformation']) }));

  return {
    ...profileData,
    transformations,
  };
};
