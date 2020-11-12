import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';

import {
  SearchField,
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
  Icon,
  Button,
} from '@folio/stripes/components';

import {
  RECORD_TYPES,
  SELECTED_STATUSES,
} from '../../../../utils';
import { CheckboxGroupField } from '../../CheckboxGroupField';

import css from './SearchForm.css';

const SearchFormComponent = ({
  form,
  values,
  disabledRecordTypes,
  handleSubmit,
  onReset,
  onFiltersChange,
}) => {
  const updateFilter = useCallback((filterKey, isChecked, option) => {
    const filterValue = values.filters[filterKey];

    const nextFilters = isChecked
      ? filterValue.concat(option.value)
      : filterValue.filter(value => value !== option.value);

    onFiltersChange(filterKey, nextFilters);
  }, [values.filters, onFiltersChange]);

  const handleRecordTypesFilterChange = useCallback(
    (event, option) => updateFilter('recordTypes', event.target.checked, option),
    [updateFilter],
  );

  const handleStatusesFilterChange = useCallback(
    (event, option) => updateFilter('statuses', event.target.checked, option),
    [updateFilter],
  );

  const handleReset = useCallback(() => {
    form.restart();
    onReset();
  }, [form, onReset]);

  return (
    <form
      data-test-transformations-search-form
      onSubmit={handleSubmit}
    >
      <div
        data-test-transformations-search-form-field
        className={css.searchGroupWrap}
      >
        <FormattedMessage id="ui-data-export.mappingProfiles.transformations.searchFields">
          {label => (
            <Field
              name="searchValue"
              marginBottom0
              render={fieldProps => (
                <SearchField
                  aria-label={label}
                  {...fieldProps.input}
                />
              )}
            />
          )}
        </FormattedMessage>
      </div>
      <div>
        <Button
          data-test-transformations-search-form-reset
          buttonStyle="none"
          onClick={handleReset}
        >
          <Icon icon="times-circle-solid">
            <FormattedMessage id="ui-data-export.resetAll" />
          </Icon>
        </Button>
      </div>
      <AccordionSet id="transformations-filter-accordions">
        <Accordion
          id="transformations-record-type-accordion"
          header={FilterAccordionHeader}
          label={<FormattedMessage id="ui-data-export.recordType" />}
          separator={false}
        >
          <CheckboxGroupField
            name="filters.recordTypes"
            filtersLabelClass={css.filtersLabel}
            options={RECORD_TYPES}
            disabledFields={disabledRecordTypes}
            onChange={handleRecordTypesFilterChange}
          />
        </Accordion>
        <Accordion
          id="transformations-status-accordion"
          header={FilterAccordionHeader}
          label={<FormattedMessage id="ui-data-export.mappingProfiles.transformations.status" />}
          separator={false}
        >
          <CheckboxGroupField
            name="filters.statuses"
            filtersLabelClass={css.filtersLabel}
            options={SELECTED_STATUSES}
            onChange={handleStatusesFilterChange}
          />
        </Accordion>
      </AccordionSet>
    </form>
  );
};

SearchFormComponent.propTypes = {
  values: PropTypes.shape({
    filters: PropTypes.shape({
      recordTypes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      statuses: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
  disabledRecordTypes: PropTypes.object,
  form: PropTypes.shape({ restart: PropTypes.func.isRequired }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};

export const SearchForm = stripesFinalForm({
  subscription: { values: true },
  navigationCheck: false,
})(SearchFormComponent);
