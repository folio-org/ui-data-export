import {
  getByTestId,
  screen,
} from '@testing-library/react';

export const getTransformationFieldGroups = () => {
  const allGroups = screen.getAllByTestId('transformation-field-group');

  return allGroups.map(group => ({
    marcField: getByTestId(group, 'transformation-marcField').querySelector('input'),
    indicator1: getByTestId(group, 'transformation-indicator1').querySelector('input'),
    indicator2: getByTestId(group, 'transformation-indicator2').querySelector('input'),
    subfield: getByTestId(group, 'transformation-subfield').querySelector('input'),
  }));
};
