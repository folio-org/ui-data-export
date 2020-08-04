import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  get,
  noop,
} from 'lodash';

import {
  Button,
  Modal,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import {
  ExpandFilterPaneButton,
  CollapseFilterPaneButton,
} from '@folio/stripes/smart-components';

import { recordTypes } from '../RecordTypeField';
import { TransformationsForm } from './TransformationsForm';
import { SearchForm } from './SearchForm';

import css from './MappingProfilesTransformationsModal.css';

const initialSearchFormValues = {
  searchValue: '',
  filters: { recordTypes: recordTypes.map(recordType => recordType.value) },
};

const fullWidthStyle = { style: { width: '100%' } };

export const MappingProfilesTransformationsModal = ({
  isOpen,
  initialTransformationsValues,
  onCancel,
}) => {
  const [isFilterPaneOpen, setFilterPaneOpen] = useState(true);
  const [searchValue, setSearchValue] = useState(initialSearchFormValues.searchValue);
  const [searchFilters, setSearchFilters] = useState(initialSearchFormValues.filters);

  const totalSelectedCount = 0;

  const resetSearchForm = useCallback(() => {
    setSearchFilters(initialSearchFormValues.filters);
    setSearchValue(initialSearchFormValues.searchValue);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFilterPaneOpen(true);
      resetSearchForm();
    }
  }, [isOpen, resetSearchForm]);

  const searchValueResults = !searchValue
    ? initialTransformationsValues.transformations
    : initialTransformationsValues.transformations
      .filter(value => value.displayName.toLowerCase().includes(searchValue));

  const searchResults = searchValueResults
    .filter(value => get(searchFilters, 'recordTypes', []).includes(value.recordType));

  const toggleFilterPane = useCallback(() => setFilterPaneOpen(curState => !curState), []);

  const handleFiltersChange = useCallback((key, value) => setSearchFilters(curFilters => ({
    ...curFilters,
    [key]: value,
  })), []);

  const handleSearchFormSubmit = useCallback(values => {
    setSearchValue(values.searchValue?.toLowerCase());
  }, []);

  const renderFooter = () => {
    return (
      <div className={css.modalFooter}>
        <Button
          data-test-transformations-cancel
          className="left"
          marginBottom0
          onClick={onCancel}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
        <div data-test-transformations-total-selected>
          <FormattedMessage
            id="ui-data-export.modal.totalSelected"
            values={{ count: totalSelectedCount }}
          />
        </div>
        <Button
          data-test-transformations-save
          buttonStyle="primary"
          marginBottom0
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
      </div>
    );
  };

  return (
    <Modal
      data-test-transformations-modal
      contentClass={css.modalContent}
      label={<FormattedMessage id="ui-data-export.mappingProfiles.transformations.selectTransformations" />}
      footer={renderFooter()}
      open={isOpen}
      dismissible
      enforceFocus={false}
      size="large"
      onClose={onCancel}
    >
      <Paneset>
        <Pane
          data-test-transformations-search-pane
          defaultWidth="30%"
          paneTitle={<FormattedMessage id="ui-data-export.searchAndFilter" />}
          lastMenu={<CollapseFilterPaneButton onClick={toggleFilterPane} />}
          hidden={!isFilterPaneOpen}
        >
          <SearchForm
            initialValues={initialSearchFormValues}
            onFiltersChange={handleFiltersChange}
            onReset={resetSearchForm}
            onSubmit={handleSearchFormSubmit}
          />
        </Pane>
        <Pane
          data-test-transformations-results-pane
          defaultWidth="fill"
          hasPadding={false}
          paneTitle={<FormattedMessage id="ui-data-export.transformations" />}
          paneSub={(
            <FormattedMessage
              id="ui-data-export.mappingProfiles.transformations.searchResultsCountHeader"
              values={{ count: searchResults.length }}
            />
          )}
          firstMenu={!isFilterPaneOpen ? <ExpandFilterPaneButton onClick={toggleFilterPane} /> : null}
          {...(!isFilterPaneOpen && fullWidthStyle)}
        >
          <TransformationsForm
            initialValues={initialTransformationsValues}
            searchResults={searchResults}
            autosize
            onSubmit={noop}
          />
        </Pane>
      </Paneset>
    </Modal>
  );
};

MappingProfilesTransformationsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  initialTransformationsValues: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
};
