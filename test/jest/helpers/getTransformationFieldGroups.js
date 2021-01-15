import {
  getByTestId,
  queryAllByTestId,
  screen,
} from '@testing-library/react';

export const getTransformationFieldGroups = () => {
  const allGroups = screen.getAllByTestId('transformation-field-group');

  return allGroups.map(group => ({
    marcField: {
      container: getByTestId(group, 'transformation-marcField'),
      input: getByTestId(group, 'transformation-marcField').querySelector('input'),
      isInvalid: getByTestId(group, 'transformation-marcField').classList.contains('isInvalid'),
    },
    indicator1: {
      container: getByTestId(group, 'transformation-indicator1'),
      input: getByTestId(group, 'transformation-indicator1').querySelector('input'),
      isInvalid: getByTestId(group, 'transformation-indicator1').classList.contains('isInvalid'),
    },
    indicator2: {
      container: getByTestId(group, 'transformation-indicator2'),
      input: getByTestId(group, 'transformation-indicator2').querySelector('input'),
      isInvalid: getByTestId(group, 'transformation-indicator2').classList.contains('isInvalid'),
    },
    subfield: {
      container: getByTestId(group, 'transformation-subfield'),
      input: getByTestId(group, 'transformation-subfield').querySelector('input'),
      isInvalid: getByTestId(group, 'transformation-subfield').classList.contains('isInvalid'),
    },
    isInvalid: Boolean(queryAllByTestId(group, 'transformation-invalid').length),
  }));
};
