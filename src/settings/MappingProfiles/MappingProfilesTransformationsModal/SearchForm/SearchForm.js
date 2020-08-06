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

import { RecordTypeField } from '../../RecordTypeField';

import css from './SearchForm.css';

const SearchFormComponent = ({
  form,
  values,
  handleSubmit,
  onReset,
  onFiltersChange,
}) => {
  const handleRecordTypeChange = useCallback((event, option) => {
    const { recordTypes } = values.filters;

    const nextFilters = event.target.checked
      ? recordTypes.concat(option.value)
      : recordTypes.filter(filter => filter !== option.value);

    onFiltersChange('recordTypes', nextFilters);
  }, [values.filters, onFiltersChange]);

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
              aria-label={label}
              marginBottom0
              render={fieldProps => <SearchField {...fieldProps.input} />}
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
          <RecordTypeField
            name="filters.recordTypes"
            filtersLabelClass={css.filtersLabel}
            onChange={handleRecordTypeChange}
          />
        </Accordion>
      </AccordionSet>
    </form>
  );
};

SearchFormComponent.propTypes = {
  values: PropTypes.shape({
    filters: PropTypes.shape({ // eslint-disable-line object-curly-newline
      recordTypes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
  form: PropTypes.shape({ restart: PropTypes.func.isRequired }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};

export const SearchForm = stripesFinalForm({
  subscription: { values: true },
  navigationCheck: false,
})(SearchFormComponent);
