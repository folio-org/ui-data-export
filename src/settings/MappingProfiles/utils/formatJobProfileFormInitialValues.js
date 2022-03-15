import { omit } from 'lodash';

export const formatJobProfileFormInitialValues = (jobProfile, additionalOmitFields = []) => {
  return { ...omit(jobProfile, ['metadata', 'userInfo', 'default', ...additionalOmitFields]) };
};
