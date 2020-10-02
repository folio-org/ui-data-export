export const getColumnIndexMapping = (columns = []) => {
  return columns.reduce((accumulator, currColumn, index) => {
    accumulator[currColumn] = index;

    return accumulator;
  }, {});
};
