import { screen } from '@testing-library/react';

export const getTransformationFieldGroups = () => {
  const marcFields = screen.getAllByTestId(/transformation-marcField/);
  const indicators1 = screen.getAllByTestId(/transformation-indicator1/);
  const indicators2 = screen.getAllByTestId(/transformation-indicator2/);
  const subfields = screen.getAllByTestId(/transformation-subfield/);

  return {
    marcFields,
    indicators1,
    indicators2,
    subfields,
  };
};
