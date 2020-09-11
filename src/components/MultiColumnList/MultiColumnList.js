import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import { HeaderGridRow } from './HeaderGridRow';
import { GridRow } from './GridRow';

import commonCss from '../../common/common.css';

export const MultiColumnList = ({
  itemsData,
  columnMapping,
  headerRowHeight,
  rowHeight,
}) => {
  const intl = useIntl();

  if (!itemsData.contentData.length) {
    return <span data-test-list-empty>{intl.formatMessage({ id: 'stripes-components.tableEmpty' })}</span>;
  }

  return (
    <div
      className={commonCss.fullScreen}
      id="mapping-profiles-form-transformations"
      role="grid"
    >
      <HeaderGridRow
        visibleColumns={itemsData.visibleColumns}
        columnMapping={columnMapping}
        columnWidths={itemsData.columnWidths}
      />
      <AutoSizer>
        {({
          height,
          width,
        }) => (
          <List
            itemData={itemsData}
            itemCount={itemsData.contentData.length}
            itemSize={rowHeight}
            width={width}
            height={height - headerRowHeight}
          >
            {GridRow}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

MultiColumnList.propTypes = {
  columnMapping: PropTypes.object.isRequired,
  itemsData: PropTypes.shape({
    contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
    visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    columnWidths: PropTypes.object.isRequired,
  }).isRequired,
  headerRowHeight: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
};
