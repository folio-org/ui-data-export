import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import {
  Button,
  Icon,
  Modal,
  Pane,
  Paneset,
  SearchField,
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
  Checkbox,
} from '@folio/stripes/components';
import {
  ExpandFilterPaneButton,
  CollapseFilterPaneButton,
} from '@folio/stripes/smart-components';

import { TransformationsForm } from './TransformationsForm';
import { mappingProfileTransformations } from './TransformationsField/transformations';

import css from './MappingProfilesTransformationsModal.css';

export const MappingProfilesTransformationsModal = ({
  isOpen,
  initialTransformationsValues,
  onCancel,
}) => {
  const [isFilterPaneOpen, setFilterPaneOpen] = useState(true);

  const totalSelectedCount = 0;
  const searchResultsCount = mappingProfileTransformations.length;

  useEffect(() => {
    if (!isOpen) {
      setFilterPaneOpen(true);
    }
  }, [isOpen]);

  const toggleFilterPane = () => {
    setFilterPaneOpen(curState => !curState);
  };

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
        {isFilterPaneOpen && (
          <Pane
            data-test-transformations-search-pane
            defaultWidth="30%"
            paneTitle={<FormattedMessage id="ui-data-export.searchAndFilter" />}
            lastMenu={<CollapseFilterPaneButton onClick={toggleFilterPane} />}
          >
            <form>
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
                  <Checkbox
                    label={<FormattedMessage id="stripes-data-transfer-components.recordTypes.instance" />}
                    fullWidth
                    checked
                  />
                  <Checkbox
                    label={<FormattedMessage id="stripes-data-transfer-components.recordTypes.holdings" />}
                    fullWidth
                    checked
                  />
                  <Checkbox
                    label={<FormattedMessage id="stripes-data-transfer-components.recordTypes.item" />}
                    fullWidth
                    checked
                  />
                </Accordion>
              </AccordionSet>
            </form>
          </Pane>
        )}
        <Pane
          data-test-transformations-results-pane
          defaultWidth="fill"
          hasPadding={false}
          paneTitle={<FormattedMessage id="ui-data-export.transformations" />}
          paneSub={(
            <FormattedMessage
              id="ui-data-export.mappingProfiles.transformations.searchResultsCountHeader"
              values={{ count: searchResultsCount }}
            />
          )}
          firstMenu={!isFilterPaneOpen ? <ExpandFilterPaneButton onClick={toggleFilterPane} /> : null}
        >
          <TransformationsForm
            initialValues={initialTransformationsValues}
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
