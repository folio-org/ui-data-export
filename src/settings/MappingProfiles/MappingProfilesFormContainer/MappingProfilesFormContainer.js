import React, {
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  isEmpty,
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
  updateTransformationsWithSelected,
} from '../MappingProfilesTransformationsModal/TransformationsField';

const isValidRecordTypesMatching = (selectedTransformations = [], selectedRecordTypes = []) => {
  if (isEmpty(selectedTransformations)) {
    return true;
  }

  const filledSelectedTransformations = selectedTransformations.filter(filledSelectedTransformation => filledSelectedTransformation.transformation);

  const recordTypesInTransformations = uniq(filledSelectedTransformations.map(({ recordType }) => recordType));

  const recordTypesDifference = selectedRecordTypes
    .filter(recordType => !recordTypesInTransformations.includes(recordType))
    .concat(recordTypesInTransformations.filter(recordType => !selectedRecordTypes.includes(recordType)));

  return isEmpty(recordTypesDifference);
};

export const MappingProfilesFormContainer = props => {
  const {
    allTransformations,
    initialTransformations,
    onSubmit,
    contentLabel,
  } = props;
  const [transformationModalOpen, setTransformationModalOpen] = useState(false);
  const [selectedTransformations, setSelectedTransformations] = useState(initialTransformations);
  const [modalTransformations, setModalTransformations] = useState({ transformations: generateTransformationFieldsValues(allTransformations, initialTransformations) });
  const calloutRef = useRef(null);
  const [initialSelectedTransformations] = useState(
    () => selectedTransformations.reduce((res, selectedTransformation) => {
      const { order } = modalTransformations.transformations
        .find(transformation => selectedTransformation.fieldId === transformation.fieldId);

      res[order] = true;

      return res;
    }, {}),
  );

  return (
    <Layer
      isOpen
      contentLabel={contentLabel}
    >
      <MappingProfilesForm
        {...props}
        transformations={selectedTransformations}
        allTransformations={allTransformations}
        onSubmit={values => {
          if (!isValidRecordTypesMatching(selectedTransformations, values.recordTypes)) {
            return { recordTypes: <FormattedMessage id="ui-data-export.mappingProfiles.validation.recordTypeMismatch" /> };
          }

          return onSubmit({
            ...values,
            transformations: [...selectedTransformations],
          });
        }}
        onAddTransformations={() => setTransformationModalOpen(true)}
      />
      <MappingProfilesTransformationsModal
        isOpen={transformationModalOpen}
        initialSelectedTransformations={initialSelectedTransformations}
        initialTransformationsValues={modalTransformations}
        onCancel={() => setTransformationModalOpen(false)}
        onSubmit={newSelectedTransformations => {
          setTransformationModalOpen(false);

          if (calloutRef.current) {
            calloutRef.current.sendCallout({
              message: <SafeHTMLMessage
                id="ui-data-export.mappingProfiles.transformations.save.successCallout"
                values={{ count: newSelectedTransformations.length }}
              />,
            });
          }

          setModalTransformations(({ transformations }) => ({ transformations: updateTransformationsWithSelected(transformations, newSelectedTransformations) }));
          setSelectedTransformations(newSelectedTransformations);
        }}
      />
      <Callout ref={calloutRef} />
    </Layer>
  );
};

MappingProfilesFormContainer.propTypes = {
  allTransformations: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialTransformations: PropTypes.arrayOf(PropTypes.object),
  contentLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

MappingProfilesFormContainer.defaultProps = { initialTransformations: [] };
