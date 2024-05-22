import React from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  FormattedMessage, useIntl,
} from 'react-intl';
import {
  noop,
  omit,
} from 'lodash';

import {
  stripesConnect,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import { Paneset } from '@folio/stripes/components';
import {
  FiltersPane,
  ResetButton,
  useToggle,
  useLocationFilters,
  SingleSearchForm,
} from '@folio/stripes-acq-components';

import { ViewAllLogsFilters } from '@folio/stripes-data-transfer-components/lib/ViewAllLogsFilters';
import { buildSortOrder } from '@folio/stripes-data-transfer-components/lib/utils';
import {
  DEFAULT_SORT_COLUMN,
  EXCLUDED_SORT_COLUMNS,
  searchableIndexes,
} from '../../utils';
import { JobLogsContainer } from '../JobLogsContainer';
import AllJobLogsList from './AllJobLogsList';
import useDefaultSorting from '../../hooks/useDefaultSorting';
import useUsers from '../../hooks/useUsers';
import useJobProfiles from '../../hooks/useJobProfiles';

export const AllJobLogsViewComponent = () => {
  const intl = useIntl();
  const stripes = useStripes();
  const history = useHistory();
  const location = useLocation();
  const data = useUsers();
  const relatedUsers = data.relatedUsers;
  const { jobProfiles } = useJobProfiles();

  useDefaultSorting(DEFAULT_SORT_COLUMN);

  const [isFiltersOpened, toggleFilters] = useToggle(true);

  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeIndex,
    searchIndex,
  ] = useLocationFilters(location, history, noop);

  const { search } = location;
  const filterObj = omit(filters, ['sort', 'qindex', 'offset', 'limit']);
  const filterValues = Object.values(filterObj).filter(Boolean);
  const isResetButtonDisabled = !filterValues.length || !search;

  const mappedSearchableIndexes = searchableIndexes.map(index => {
    const label = intl.formatMessage({ id: `ui-data-export.${index.label}` });
    const placeholder = index?.placeholder ? intl.formatMessage({ id: `ui-data-export.placeholder.${index.placeholder}` }) : '';

    return {
      ...index,
      label,
      placeholder,
    };
  });

  const handleApplyFilters = ({
    name, values,
  }) => applyFilters(name, values);

  const handleSort = (_, meta) => {
    const fieldName = meta.name;

    if (EXCLUDED_SORT_COLUMNS.includes(fieldName)) return;

    const [currentSort] = filters.sort || [DEFAULT_SORT_COLUMN];
    const newSort = buildSortOrder(currentSort, fieldName, DEFAULT_SORT_COLUMN, 1);

    handleApplyFilters({ name: 'sort', values: [newSort] });
  };

  return (
    <TitleManager stripes={stripes} record={intl.formatMessage({ id: 'ui-data-export.title.logs' })}>
      <Paneset data-test-log-events-list>
        {isFiltersOpened && (
          <FiltersPane toggleFilters={toggleFilters}>
            <SingleSearchForm
              applySearch={applySearch}
              changeSearch={changeSearch}
              searchQuery={searchQuery}
              ariaLabelId="ui-data-export.search"
              searchableIndexes={mappedSearchableIndexes}
              changeSearchIndex={changeIndex}
              selectedIndex={searchIndex}
            />
            <ResetButton
              id="reset-export-filters"
              disabled={isResetButtonDisabled}
              reset={resetFilters}
              label={<FormattedMessage id="ui-data-export.resetFilters" />}
            />
            <ViewAllLogsFilters
              showUsers
              users={relatedUsers}
              activeFilters={filters}
              jobProfiles={jobProfiles}
              onChange={handleApplyFilters}
            />
          </FiltersPane>
        )}
        <JobLogsContainer>
          {({
            listProps,
            onRowClick,
          }) => (
            <AllJobLogsList
              filters={filters}
              isFiltersOpened={isFiltersOpened}
              onRowClick={onRowClick}
              onToggleFilters={toggleFilters}
              onSortChange={handleSort}
              {...listProps}
            />
          )}
        </JobLogsContainer>
      </Paneset>
    </TitleManager>
  );
};

export const AllJobLogsView = stripesConnect(AllJobLogsViewComponent);
