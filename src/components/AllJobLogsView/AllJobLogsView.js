import React, {
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  FormattedMessage, useIntl,
} from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  SearchAndSortPane,
  SettingsLabel,
} from '@folio/stripes-data-transfer-components';
import {
  get,
  omit,
} from 'lodash';
import { Paneset } from '@folio/stripes/components';
import {
  FiltersPane,
  ResetButton,
  useToggle,
  useLocationFilters,
  SingleSearchForm,
} from '@folio/stripes-acq-components';
import { ViewAllLogsFilters } from '@folio/stripes-data-transfer-components/lib/ViewAllLogsFilters';

import FilterPaneToggle from '@folio/stripes-acq-components/lib/AcqList/ResultsPane/FilterPaneToggle';
import {
  INITIAL_RESULT_COUNT,
  JOB_EXECUTION_STATUSES,
  JOB_LOGS_STATUS_QUERY_VALUE,
  RESULT_COUNT_INCREMENT,
  searchableIndexes,
} from '../../utils';
import { JobLogsContainer } from '../JobLogsContainer';
import {
  makeQueryBuilder,
  buildDateTimeRangeQuery,
  getQindex,
} from './CustomQueryBuilder';

const excludedSortColumns = ['fileName'];
const jobStatusFailString = 'status=(FAIL or COMPLETED_WITH_ERRORS)';
const initialQuery = '?qindex=hrID&sort=-completedDate';
const defaultSorting = '-completedDate';
const defaultSortingSearch = '?sort=-completedDate';

const buildJobsQuery = makeQueryBuilder(
  `status=(${JOB_LOGS_STATUS_QUERY_VALUE})`,
  query => `query=${query}`,
  'sortby completedDate/sort.descending',
  {
    completedDate: buildDateTimeRangeQuery.bind(null, ['completedDate']),
    startedDate: buildDateTimeRangeQuery.bind(null, ['startedDate']),
    status: query => {
      switch (true) {
        case query === JOB_EXECUTION_STATUSES.FAIL:
          return jobStatusFailString;
        case Array.isArray(query):
          return `status=(${query.map(v => (
            v === JOB_EXECUTION_STATUSES.COMPLETED
              ? JOB_LOGS_STATUS_QUERY_VALUE
              : `"${v}"`)).join(' or ')})`;
        default:
          return `status=${query}`;
      }
    },
    hrId: query => `hrid="${query}"`,
    'runBy.userId': query => `runById="${query}"`,
  },
  {
    hrId: 'hrid/number',
    '-hrId': '-hrid/number',
    totalRecords: 'total/number',
    '-totalRecords': '-total/number',
    errors: 'failed/number',
    '-errors': '-failed/number',
    exported: 'exported/number',
    '-exported': '-exported/number',
    updated: 'updatedDate',
    '-updated': '-updatedDate',
    jobProfileName: 'jobProfileName',
    '-jobProfileName': '-jobProfileName',
    runBy: 'runByFirstName runByLastName',
    '-runBy': '-runByFirstName runByLastName',
    startedDate: 'startedDate',
    '-startedDate': '-startedDate',
  }
);

const onResetData = () => {};

export const AllJobLogsViewComponent = ({
  resources,
  mutator,
}) => {
  const intl = useIntl();
  const [isFiltersOpened, toggleFilters] = useToggle(true);
  const history = useHistory();
  const location = useLocation();
  const { search } = location;

  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeIndex,
    searchIndex,
  ] = useLocationFilters(location, history, onResetData);

  const applyFiltersAdapter = callBack => ({
    name, values,
  }) => callBack(name, values);
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters]
  );

  const getSearchableIndexes = () => {
    return searchableIndexes.map(index => {
      const label = intl.formatMessage({ id: `ui-data-export.${index.label}` });
      const placeholder = index?.placeholder ? intl.formatMessage({ id: `ui-data-export.placeholder.${index.placeholder}` }) : '';

      return {
        ...index,
        label,
        placeholder,
      };
    });
  };

  const jobProfiles = get(resources, ['jobProfilesList', 'records'], [])
    .sort((jobProfileA, jobProfileB) => jobProfileA.name?.localeCompare(jobProfileB.name));

  const totalCounts = get(resources, ['jobExecutions', 'other', 'totalRecords']);

  const users = get(resources, ['usersList', 'records'], [])
    .map(item => {
      return {
        userId: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
      };
    })
    .sort((userA, userB) => {
      const nameA = userA.firstName || userA.lastName;
      const nameB = userB.firstName || userB.lastName;

      if (userA.firstName?.localeCompare(userB.firstName) === 0) {
        return userA.lastName.localeCompare(userB.lastName);
      }

      return nameA.localeCompare(nameB);
    });

  const renderFirstMenu = () => (isFiltersOpened ?
    null :
    (
      <FilterPaneToggle
        filters={filters}
        toggleFiltersPane={toggleFilters}
      />
    ));

  const isResetButtonDisabled = location.search === initialQuery ||
    location.search === defaultSortingSearch ||
    !search;

  useEffect(() => {
    mutator.resultOffset.replace(0);
  }, [search]);

  return (
    <Paneset data-test-log-events-list>
      {isFiltersOpened && (
      <FiltersPane toggleFilters={toggleFilters}>
        <SingleSearchForm
          applySearch={applySearch}
          changeSearch={changeSearch}
          searchQuery={searchQuery}
          ariaLabelId="ui-data-export.search"
          searchableIndexes={getSearchableIndexes()}
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
          users={users}
          activeFilters={filters}
          jobProfiles={jobProfiles}
          queryMutator={mutator.query}
          showUsers
          onChange={adaptedApplyFilters}
        />
      </FiltersPane>
      )}
      <JobLogsContainer>
        {({
          listProps,
          onRowClick,
        }) => (
          <SearchAndSortPane
            objectName="job-executions"
            label={(
              <SettingsLabel
                messageId="ui-data-export.logsPaneTitle"
                iconKey="app"
                app="data-export"
              />
          )}
            resultCountMessageId="ui-data-export.searchResultsCountHeader"
            resourceName="jobExecutions"
            hasSearchForm={false}
            firstMenu={renderFirstMenu()}
            shouldSetInitialSort
            defaultSort={defaultSorting}
            lastMenu={<div />}
            initialResultCount={INITIAL_RESULT_COUNT}
            resultCountIncrement={RESULT_COUNT_INCREMENT}
            shouldSetInitialSortOnMount
            parentMutator={mutator}
            parentResources={resources}
            maxSortKeys={1}
            pagingType="prev-next"
            virtualize={false}
            pageAmount={RESULT_COUNT_INCREMENT}
            totalRecordsCount={totalCounts}
            excludedSortColumns={excludedSortColumns}
            searchResultsProps={{
              rowProps: null,
              onRowClick,
            }}
            {...listProps}
          />
        )}
      </JobLogsContainer>
    </Paneset>
  );
};

AllJobLogsViewComponent.manifest = Object.freeze({
  initializedFilterConfig: {
    initialValue: {
      query: '',
      qindex: 'hrID',
    },
  },
  query: {
    initialValue: {
      query: '',
      qindex: 'hrID',
    },
  },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  jobExecutions: {
    type: 'okapi',
    path: 'data-export/job-executions',
    records: 'jobExecutions',
    resultOffset: '%{resultOffset}',
    recordsRequired: '%{resultCount}',
    resultDensity: 'sparse',
    perRequest: RESULT_COUNT_INCREMENT,
    params: (queryParams, pathComponents, resourceData) => {
      const {
        query,
        qindex,
      } = resourceData.query;

      const customField = getQindex(qindex, query);
      const buildedQuery = {
        ...omit(resourceData.query, ['qindex', 'query']),
        ...customField,
      };

      return { query: buildJobsQuery(buildedQuery) };
    },
  },
  usersList: {
    type: 'okapi',
    records: 'relatedUsers',
    path: 'data-export/related-users',
    throwErrors: false,
    perRequest: RESULT_COUNT_INCREMENT,
  },
  jobProfilesList: {
    type: 'okapi',
    records: 'jobProfiles',
    path: 'data-export/job-profiles?used=true&limit=1000',
    throwErrors: false,
  },
});

AllJobLogsViewComponent.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

export const AllJobLogsView = stripesConnect(AllJobLogsViewComponent);
