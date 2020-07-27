import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
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
  values,
  handleSubmit,
  onFiltersChange,
}) => {
  const handleRecordTypeChange = useCallback((event, option) => {
    const { recordTypes } = values.filters;

    const nextFilters = event.target.checked
      ? recordTypes.concat(option.value)
      : recordTypes.filter(filter => filter !== option.value);

    onFiltersChange('recordTypes', nextFilters);
  }, [values.filters, onFiltersChange]);

  return (
    <form onSubmit={handleSubmit}>
      <div className={css.searchGroupWrap}>
        <FormattedMessage id="ui-data-export.mappingProfiles.transformations.searchFields">
          {label => (
            <SearchField
              data-test-transformations-search-field
              aria-label={label}
              autoFocus
              marginBottom0
            />
          )}
        </FormattedMessage>
      </div>
      <div>
        <Button
          data-test-transformations-reset
          buttonStyle="none"
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
      recordTypes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
};

export const SearchForm = stripesFinalForm({
  subscription: { values: true },
  navigationCheck: false,
})(SearchFormComponent);
