import React from 'react';
import PropTypes from 'prop-types';

import css from './GridCell.css';

export const GridCell = React.memo(({
  width,
  columnFormatter,
  rowData,
}) => {
  return (
    <div
      role="gridcell"
      className={css.mclCell}
      style={{ width }}
    >
      {columnFormatter(rowData)}
    </div>
  );
});

GridCell.propTypes = {
  width: PropTypes.string.isRequired,
  columnFormatter: PropTypes.func.isRequired,
  rowData: PropTypes.object.isRequired,
};
