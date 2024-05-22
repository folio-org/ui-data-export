import React from 'react';
import PropTypes from 'prop-types';

import { PrevNextPagination, ResultsPane, usePagination, buildFilterQuery, ASC_DIRECTION, DESC_DIRECTION } from '@folio/stripes-acq-components';
import { MultiColumnList, Paneset } from '@folio/stripes/components';
import { SettingsLabel } from '@folio/stripes-data-transfer-components';

import { useStripes } from '@folio/stripes/core';
import { omit } from 'lodash';
import useJobExecutions from '../../hooks/useJobExecutions';
import { buildSortingQuery, connectQuery } from './CustomQueryBuilder';
import {
  DEFAULT_SORT_COLUMN, getFormattedFilters,
  getMappedFilters,
  JOB_LOGS_STATUS_QUERY_VALUE,
  PAGINATION_CONFIG,
  SORT_MAP
} from '../../utils';

const AllJobLogsList = ({
  filters,
  isFiltersOpened,
  columnWidths,
  columnMapping,
  resultsFormatter,
  visibleColumns,
  onToggleFilters,
  onRowClick,
  onSortChange
}) => {
  const stripes = useStripes();
  const {
    pagination,
    changePage,
  } = usePagination(PAGINATION_CONFIG);

  const currentSort = filters.sort?.[0] || DEFAULT_SORT_COLUMN;
  const sortDirection = currentSort.startsWith('-') ? DESC_DIRECTION : ASC_DIRECTION;
  const sortOrder = currentSort.replace(/^-/, '').replace(/,.*/, '');
  const sortQuery = buildSortingQuery({ sort: currentSort }, SORT_MAP);

  const formattedFilters = getFormattedFilters(filters);
  const filtersWithoutSorting = omit(formattedFilters, ['sort']);
  const filterQuery = buildFilterQuery(
    filtersWithoutSorting,
    query => `hrid=${query}`,
    getMappedFilters(stripes.timezone)
  ) || `status=(${JOB_LOGS_STATUS_QUERY_VALUE})`;

  const { jobExecutions, totalRecords, isFetching } = useJobExecutions({
    ...pagination,
    query: connectQuery(filterQuery, sortQuery),
  });

  return (
    <Paneset>
      <ResultsPane
        id="data-export-logs-pane"
        autosize
        title={(
          <SettingsLabel
            messageId="ui-data-export.logsPaneTitle"
            iconKey="app"
            app="data-export"
          />
      )}
        count={totalRecords}
        isLoading={false}
        toggleFiltersPane={onToggleFilters}
        isFiltersOpened={isFiltersOpened}
      >
        {({ height, width }) => (
          <>
            <MultiColumnList
              loading={isFetching}
              contentData={jobExecutions}
              totalCount={totalRecords}
              onHeaderClick={onSortChange}
              columnWidths={columnWidths}
              columnMapping={columnMapping}
              formatter={resultsFormatter}
              visibleColumns={visibleColumns}
              onRowClick={onRowClick}
              pagingType="none"
              hasMargin
              height={height - PrevNextPagination.HEIGHT}
              width={width}
              sortDirection={sortDirection}
              sortOrder={sortOrder}
            />

            {jobExecutions?.length > 0 && (
            <PrevNextPagination
              {...pagination}
              totalCount={totalRecords}
              disabled={false}
              onChange={changePage}
            />
            )}
          </>
        )}
      </ResultsPane>
    </Paneset>
  );
};

AllJobLogsList.propTypes = {
  filters: PropTypes.object.isRequired,
  isFiltersOpened: PropTypes.bool.isRequired,
  columnWidths: PropTypes.object.isRequired,
  columnMapping: PropTypes.object.isRequired,
  resultsFormatter: PropTypes.object.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleFilters: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default AllJobLogsList;
