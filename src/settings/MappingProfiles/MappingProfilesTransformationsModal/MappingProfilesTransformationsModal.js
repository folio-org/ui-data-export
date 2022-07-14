import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  get,
  noop,
  isEmpty,
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

import {
  RECORD_TYPES,
  SELECTED_STATUS,
  SELECTED_STATUSES,
} from '../../../utils';
import { TransformationsForm } from './TransformationsForm';
import { SearchForm } from './SearchForm';
import { normalizeTransformationFormValues } from './TransformationsField';
import { validateTransformations } from './validateTransformations';

import css from './MappingProfilesTransformationsModal.css';

const initialSearchFormValues = {
  searchValue: '',
  filters: {
    recordTypes: RECORD_TYPES.map(({ value }) => value),
    statuses: SELECTED_STATUSES.map(({ value }) => value),
  },
};

const statusesFilterMap = {
  [SELECTED_STATUS.SELECTED]: ({ fieldId }, selectedTransformations) => Boolean(selectedTransformations[fieldId]),
  [SELECTED_STATUS.UNSELECTED]: ({ fieldId }, selectedTransformations) => !selectedTransformations[fieldId],
};

const fullWidthStyle = { style: { width: '100%' } };

export const MappingProfilesTransformationsModal = ({
  isOpen,
  initialTransformationsValues,
  initialSelectedTransformations = {},
  disabledRecordTypes = {},
  onCancel,
  onSubmit,
}) => {
  const [isFilterPaneOpen, setFilterPaneOpen] = useState(true);
  const [searchValue, setSearchValue] = useState(initialSearchFormValues.searchValue);
  const [searchFilters, setSearchFilters] = useState(initialSearchFormValues.filters);
  const [selectedTransformations, setSelectedTransformations] = useState(initialSelectedTransformations);
  const transformationsFormStateRef = useRef(null);
  const initialFormValues = useMemo(() => ({
    searchValue: initialSearchFormValues.searchValue,
    filters: searchFilters,
  }), [searchFilters, searchValue]);
  const [validatedTransformations, setValidatedTransformations] = useState({});
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const resetSearchForm = useCallback(() => {
    setSearchFilters({
      ...initialSearchFormValues.filters,
      recordTypes: initialSearchFormValues.filters.recordTypes.filter(record => !disabledRecordTypes[record]),
    });
    setSearchValue(initialSearchFormValues.searchValue);
  }, [disabledRecordTypes]);

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

  const searchResults = [];
  let displayedCheckedItemsAmount = 0;

  const filterMap = {
    recordTypes: (filters, transformation) => filters.includes(transformation.recordType),
    statuses: (filters, transformation) => filters.some(status => statusesFilterMap[status](transformation, selectedTransformations)),
  };

  searchValueResults.forEach(transformation => {
    const hasFilterMatch = Object.keys(filterMap)
      .every(filterKey => {
        const filter = get(searchFilters, filterKey, []);

        return filterMap[filterKey](filter, transformation);
      });

    if (hasFilterMatch) {
      searchResults.push(transformation);

      if (selectedTransformations[transformation.fieldId]) {
        displayedCheckedItemsAmount++;
      }
    }
  });

  const toggleFilterPane = useCallback(() => setFilterPaneOpen(curState => !curState), []);

  const handleFiltersChange = useCallback((key, value) => setSearchFilters(curFilters => ({
    ...curFilters,
    [key]: value,
  })), []);

  const handleSelectChange = useCallback(
    transformations => {
      if (isSubmitButtonDisabled) {
        setIsSubmitButtonDisabled(false);
      }

      setSelectedTransformations(transformations);
    }, [isSubmitButtonDisabled]
  );

  const handleSearchFormSubmit = useCallback(values => {
    setSearchValue(values.searchValue?.toLowerCase());
  }, []);

  const handleCancel = () => {
    setValidatedTransformations({});
    setIsSubmitButtonDisabled(false);
    setSelectedTransformations(initialSelectedTransformations);

    onCancel();
  };

  const handleSaveButtonClick = () => {
    const transformations = get(transformationsFormStateRef.current.getState(), 'values.transformations', []);
    const invalidTransformations = validateTransformations(transformations);
    const isTransformationFormValid = isEmpty(invalidTransformations);

    if (isTransformationFormValid) {
      const normalizedTransformations = normalizeTransformationFormValues(transformations);

      setValidatedTransformations({});
      setIsSubmitButtonDisabled(false);

      onSubmit(normalizedTransformations);
    } else {
      setValidatedTransformations(invalidTransformations);
      setIsSubmitButtonDisabled(true);
    }
  };

  const renderFooter = () => {
    return (
      <div className={css.modalFooter}>
        <Button
          data-test-transformations-cancel
          className="left"
          marginBottom0
          onClick={handleCancel}
        >
          <FormattedMessage id="stripes-components.cancel" />
        </Button>
        <div data-test-transformations-total-selected>
          <FormattedMessage
            id="ui-data-export.modal.totalSelected"
            values={{ count: Object.keys(selectedTransformations).length }}
          />
        </div>
        <Button
          data-test-transformations-save
          buttonStyle="primary"
          disabled={isSubmitButtonDisabled}
          marginBottom0
          onClick={handleSaveButtonClick}
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
      onClose={handleCancel}
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
            initialValues={initialFormValues}
            disabledRecordTypes={disabledRecordTypes}
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
            id="transformations-form"
            stateRef={transformationsFormStateRef}
            initialValues={initialTransformationsValues}
            searchResults={searchResults}
            validatedTransformations={validatedTransformations}
            isSelectAllChecked={displayedCheckedItemsAmount === searchResults.length}
            setValidatedTransformations={setValidatedTransformations}
            setIsSubmitButtonDisabled={setIsSubmitButtonDisabled}
            onSelectChange={handleSelectChange}
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
  initialSelectedTransformations: PropTypes.object,
  disabledRecordTypes: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
