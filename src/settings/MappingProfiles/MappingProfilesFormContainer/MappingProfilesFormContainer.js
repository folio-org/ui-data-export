import React, {
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

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
  const { onSubmit } = props;
  const [transformationModalOpen, setTransformationModalOpen] = useState(false);
  const [selectedTransformations, setSelectedTransformations] = useState([]);
  const initialTransformationsValues = { transformations: generateTransformationFieldsValues(mappingProfileTransformations) };
  const calloutRef = useRef(null);
  const intl = useIntl();

  return (
    <Layer
      isOpen
      contentLabel={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.newProfile' })}
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
                id="ui-data-export.mappingProfiles.transformations.savedCallout"
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

MappingProfilesFormContainer.propTypes = { onSubmit: PropTypes.func.isRequired };
