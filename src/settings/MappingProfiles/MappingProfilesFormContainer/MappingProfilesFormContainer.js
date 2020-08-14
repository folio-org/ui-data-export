import React, {
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import {
  Layer,
  Callout,
} from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { MappingProfilesTransformationsModal } from '../MappingProfilesTransformationsModal';
import { MappingProfilesForm } from '../MappingProfilesForm';
import { mappingProfileTransformations } from '../MappingProfilesTransformationsModal/TransformationsField/transformations';
import { generateTransformationFieldsValues } from '../MappingProfilesTransformationsModal/TransformationsField';

export const MappingProfilesFormContainer = props => {
  const {
    initialTransformations,
    onSubmit,
    contentLabel,
  } = props;
  const [transformationModalOpen, setTransformationModalOpen] = useState(false);
  const [selectedTransformations, setSelectedTransformations] = useState(initialTransformations);
  const initialTransformationsValues = { transformations: generateTransformationFieldsValues(mappingProfileTransformations) };
  const calloutRef = useRef(null);

  return (
    <Layer
      isOpen
      contentLabel={contentLabel}
    >
      <MappingProfilesForm
        {...props}
        transformations={selectedTransformations}
        onSubmit={values => onSubmit({
          ...values,
          transformations: [...selectedTransformations],
        })}
        onAddTransformations={() => setTransformationModalOpen(true)}
      />
      <MappingProfilesTransformationsModal
        isOpen={transformationModalOpen}
        initialTransformationsValues={initialTransformationsValues}
        onCancel={() => setTransformationModalOpen(false)}
        onSubmit={transformations => {
          setTransformationModalOpen(false);

          if (calloutRef.current) {
            calloutRef.current.sendCallout({
              message: <SafeHTMLMessage
                id="ui-data-export.mappingProfiles.transformations.save.successCallout"
                values={{ count: transformations.length }}
              />,
            });
          }

          setSelectedTransformations(transformations);
        }}
      />
      <Callout ref={calloutRef} />
    </Layer>
  );
};

MappingProfilesFormContainer.propTypes = {
  initialTransformations: PropTypes.arrayOf(PropTypes.object),
  contentLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

MappingProfilesFormContainer.defaultProps = { initialTransformations: [] };
