import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import { Layer } from '@folio/stripes/components';
import { FullScreenForm } from '@folio/stripes-data-transfer-components';

export const MappingProfilesForm = ({ onCancel }) => {
  return (
    <FormattedMessage id="ui-data-export.mappingProfiles.newProfile">
      {contentLabel => (
        <Layer
          isOpen
          contentLabel={contentLabel}
        >
          <FullScreenForm
            paneTitle={<FormattedMessage id="ui-data-export.mappingProfiles.newProfile" />}
            onSubmit={noop}
            onCancel={onCancel}
          />
        </Layer>
      )}
    </FormattedMessage>
  );
};

MappingProfilesForm.propTypes = { onCancel: PropTypes.func };

MappingProfilesForm.defaultProps = { onCancel: noop };
