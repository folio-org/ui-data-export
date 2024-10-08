import React, {
  useState,
  useRef,
  useMemo,
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
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { MappingProfilesTransformationsModal } from '../MappingProfilesTransformationsModal';
import { MappingProfilesForm } from '../MappingProfilesForm';
import {
  generateTransformationFieldsValues,
  generateSelectedTransformations,
} from '../MappingProfilesTransformationsModal/TransformationsField';
import { RECORD_TYPES_DISABLING_MAPPING } from '../../../utils';
import { omitRawTransformations } from './processRawTransformations';

const isValidRecordTypesMatching = (selectedTransformations = [], selectedRecordTypes = []) => {
  const isOnlySrsSelected = selectedRecordTypes.length === 1 && selectedRecordTypes[0] === FOLIO_RECORD_TYPES.SRS.type;

  if (isEmpty(selectedTransformations) && !isOnlySrsSelected) {
    return false;
  }

  const recordTypesInTransformations = uniq(selectedTransformations.map(({ recordType }) => recordType));

  const validatedRecords = selectedRecordTypes.filter(recordType => recordType !== FOLIO_RECORD_TYPES.SRS.type);

  return isEmpty(difference(recordTypesInTransformations, validatedRecords))
    && isEmpty(difference(validatedRecords, recordTypesInTransformations));
};

export const MappingProfilesFormContainer = props => {
  const {
    isEditMode = false,
    allTransformations,
    contentLabel,
    initialValues,
    onSubmit,
  } = props;
  const [transformationModalOpen, setTransformationModalOpen] = useState(false);
  const [selectedTransformations, setSelectedTransformations] = useState(initialValues.transformations);
  const [modalTransformations, setModalTransformations] = useState({ transformations: generateTransformationFieldsValues(allTransformations, initialValues.transformations) });
  const calloutRef = useRef(null);
  const getSelectedTransformationsInAllTransformations = selectedTransformation => modalTransformations.transformations
    .find(transformation => selectedTransformation.fieldId === transformation.fieldId);
  const [initialSelectedTransformations, setInitialSelectedTransformations] = useState(
    () => generateSelectedTransformations(selectedTransformations, getSelectedTransformationsInAllTransformations)
  );

  const [disabledRecordTypes, setDisabledRecordTypes] = useState({
    [FOLIO_RECORD_TYPES.SRS.type]: false,
    [FOLIO_RECORD_TYPES.INSTANCE.type]: false,
  });
  const initiallyDisabledRecordTypes = useMemo(() => {
    const disabledFields = {};

    initialValues.recordTypes.forEach(record => {
      if (RECORD_TYPES_DISABLING_MAPPING[record]) {
        disabledFields[RECORD_TYPES_DISABLING_MAPPING[record]] = true;
      }
    });

    return disabledFields;
  }, [initialValues]);

  const onFromSubmit = values => {
    if (!isValidRecordTypesMatching(selectedTransformations, values.recordTypes)) {
      return { recordTypes: <FormattedMessage id="ui-data-export.mappingProfiles.validation.recordTypeMismatch" /> };
    }

    return onSubmit(omitRawTransformations(values));
  };

  const onModalSubmit = newSelectedTransformations => {
    setTransformationModalOpen(false);

    if (calloutRef.current) {
      calloutRef.current.sendCallout({
        message: isEditMode
          ? <FormattedMessage id="ui-data-export.mappingProfiles.transformations.update.successCallout" />
          : (
            <FormattedMessage
              id="ui-data-export.mappingProfiles.transformations.save.successCallout"
              values={{ count: newSelectedTransformations.length }}
            />
          ),
      });
      setModalTransformations(() => ({ transformations: generateTransformationFieldsValues(allTransformations, newSelectedTransformations) }));
      setSelectedTransformations(newSelectedTransformations);
      setInitialSelectedTransformations(generateSelectedTransformations(newSelectedTransformations, getSelectedTransformationsInAllTransformations));
    }
  };

  return (
    <Layer
      isOpen
      contentLabel={contentLabel}
    >
      <MappingProfilesForm
        {...props}
        transformations={selectedTransformations}
        allTransformations={allTransformations}
        initiallyDisabledRecordTypes={initiallyDisabledRecordTypes}
        onSubmit={onFromSubmit}
        onAddTransformations={() => setTransformationModalOpen(true)}
        onTypeDisable={disabledType => setDisabledRecordTypes(disabledType)}
      />
      <MappingProfilesTransformationsModal
        isOpen={transformationModalOpen}
        initialSelectedTransformations={initialSelectedTransformations}
        initialTransformationsValues={modalTransformations}
        disabledRecordTypes={disabledRecordTypes}
        onCancel={() => setTransformationModalOpen(false)}
        onSubmit={onModalSubmit}
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
