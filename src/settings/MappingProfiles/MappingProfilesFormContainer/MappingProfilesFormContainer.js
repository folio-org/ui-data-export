import React, {
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  isEmpty,
  difference,
  uniq,
} from 'lodash';

import {
  Layer,
  Callout,
} from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { MappingProfilesTransformationsModal } from '../MappingProfilesTransformationsModal';
import { MappingProfilesForm } from '../MappingProfilesForm';
import {
  generateTransformationFieldsValues,
  generateSelectedTransformations,
} from '../MappingProfilesTransformationsModal/TransformationsField';
import { RECORD_TYPES_DISABLING_MAPPING } from '../../../utils';

const isValidRecordTypesMatching = (selectedTransformations = [], selectedRecordTypes = []) => {
  if (isEmpty(selectedTransformations)) {
    return true;
  }

  const recordTypesInTransformations = uniq(selectedTransformations.map(({ recordType }) => recordType));

  return isEmpty(difference(recordTypesInTransformations, selectedRecordTypes))
    && isEmpty(difference(selectedRecordTypes, recordTypesInTransformations));
};

export const MappingProfilesFormContainer = props => {
  const {
    allTransformations,
    contentLabel,
    isEditMode,
    initialValues,
    onSubmit,
  } = props;
  const [transformationModalOpen, setTransformationModalOpen] = useState(false);
  const [selectedTransformations, setSelectedTransformations] = useState(initialValues.transformations);
  const [modalTransformations, setModalTransformations] = useState({ transformations: generateTransformationFieldsValues(allTransformations, initialValues.transformations) });
  const calloutRef = useRef(null);
  const [initialSelectedTransformations] = useState(
    () => generateSelectedTransformations(
      selectedTransformations,
      selectedTransformation => modalTransformations.transformations
        .find(transformation => selectedTransformation.fieldId === transformation.fieldId),
    ),
  );
  const [disabledRecordType, setDisabledRecordType] = useState(null);
  const [initiallyDisabledRecord] = useState(() => {
    const disabledFields = {};

    if (initialValues.recordTypes) {
      initialValues.recordTypes.forEach(record => {
        if (RECORD_TYPES_DISABLING_MAPPING[record]) {
          disabledFields[RECORD_TYPES_DISABLING_MAPPING[record]] = true;
        }
      });
    }

    return disabledFields;
  });

  return (
    <Layer
      isOpen
      contentLabel={contentLabel}
    >
      <MappingProfilesForm
        {...props}
        transformations={selectedTransformations}
        allTransformations={allTransformations}
        initiallyDisabledRecord={initiallyDisabledRecord}
        onSubmit={values => {
          if (!isValidRecordTypesMatching(selectedTransformations, values.recordTypes)) {
            return { recordTypes: <FormattedMessage id="ui-data-export.mappingProfiles.validation.recordTypeMismatch" /> };
          }

          return onSubmit(values);
        }}
        onAddTransformations={() => setTransformationModalOpen(true)}
        onTypeDisable={disabledType => setDisabledRecordType(disabledType)}
      />
      <MappingProfilesTransformationsModal
        isOpen={transformationModalOpen}
        initialSelectedTransformations={initialSelectedTransformations}
        initialTransformationsValues={modalTransformations}
        disabledTypes={disabledRecordType}
        onCancel={() => setTransformationModalOpen(false)}
        onSubmit={newSelectedTransformations => {
          setTransformationModalOpen(false);

          if (calloutRef.current) {
            calloutRef.current.sendCallout({
              message: isEditMode
                ? <FormattedMessage id="ui-data-export.mappingProfiles.transformations.update.successCallout" />
                : (
                  <SafeHTMLMessage
                    id="ui-data-export.mappingProfiles.transformations.save.successCallout"
                    values={{ count: newSelectedTransformations.length }}
                  />
                ),
            });
          }

          setModalTransformations(() => ({ transformations: generateTransformationFieldsValues(allTransformations, newSelectedTransformations) }));
          setSelectedTransformations(newSelectedTransformations);
        }}
      />
      <Callout ref={calloutRef} />
    </Layer>
  );
};

MappingProfilesFormContainer.propTypes = {
  initialValues: PropTypes.object.isRequired,
  allTransformations: PropTypes.arrayOf(PropTypes.object).isRequired,
  contentLabel: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

MappingProfilesFormContainer.defaultProps = { isEditMode: false };
