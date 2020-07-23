import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Layer } from '@folio/stripes/components';

import { MappingProfilesTransformationsModal } from '../MappingProfilesTransformationsModal';
import { MappingProfilesForm } from '../MappingProfilesForm';
import { mappingProfileTransformations } from '../MappingProfilesTransformationsModal/TransformationsField/transformations';
import { generateTransformationFieldsValues } from '../MappingProfilesTransformationsModal/TransformationsField';

export const MappingProfilesFormContainer = props => {
  const [transformationModalOpen, setTransformationModalOpen] = useState(false);
  const initialTransformationsValues = { transformations: generateTransformationFieldsValues(mappingProfileTransformations) };

  return (
    <FormattedMessage id="ui-data-export.mappingProfiles.newProfile">
      {contentLabel => (
        <Layer
          isOpen
          contentLabel={contentLabel}
        >
          <MappingProfilesForm
            {...props}
            onAddTransformations={() => setTransformationModalOpen(true)}
          />
          <MappingProfilesTransformationsModal
            isOpen={transformationModalOpen}
            initialTransformationsValues={initialTransformationsValues}
            onCancel={() => setTransformationModalOpen(false)}
          />
        </Layer>
      )}
    </FormattedMessage>
  );
};
