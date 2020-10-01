import { omit } from 'lodash';

export const formatMappingProfileFormInitialValues = (mappingProfile, additionalOmitFields = []) => {
  return {
    ...omit(mappingProfile, 'userInfo', 'metadata', 'transformations', ...additionalOmitFields),
    transformations: mappingProfile.transformations || [],
  };
};
