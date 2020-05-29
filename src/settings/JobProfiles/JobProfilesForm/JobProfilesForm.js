import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { noop } from 'lodash';
import { Field } from 'react-final-form';

import {
  Layer,
  TextField,
  TextArea,
  Select,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  FullScreenForm,
  Preloader,
} from '@folio/stripes-data-transfer-components';

import { required } from '../../../utils';

import css from './JobProfilesForm.css';

const validate = values => {
  const errors = {};

  errors.name = required(values.name);
  errors.mappingProfileId = required(values.mappingProfileId);

  return errors;
};

const JobProfilesForm = props => {
  const {
    onCancel,
    handleSubmit,
    pristine,
    submitting,
    hasLoaded,
    mappingProfiles,
  } = props;

  const intl = useIntl();

  return (
    <FormattedMessage id="ui-data-export.mappingProfiles.newProfile">
      {contentLabel => (
        <Layer
          isOpen
          contentLabel={contentLabel}
        >
          <FullScreenForm
            id="job-profiles-form"
            paneTitle={<FormattedMessage id="ui-data-export.jobProfiles.newProfile" />}
            isSubmitButtonDisabled={pristine || submitting}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          >
            {!hasLoaded && <Preloader />}
            {hasLoaded && (
              <div className={css.jobProfilesFormContent}>
                <div data-test-job-profile-form-name>
                  <Field
                    label={<FormattedMessage id="stripes-data-transfer-components.name" />}
                    name="name"
                    id="job-profile-name"
                    component={TextField}
                    fullWidth
                    required
                  />
                </div>
                <div data-test-job-profile-form-mapping-profile>
                  <Field
                    label={<FormattedMessage id="ui-data-export.mappingProfile" />}
                    name="mappingProfileId"
                    id="mapping-profile-id"
                    component={Select}
                    dataOptions={mappingProfiles}
                    placeholder={intl.formatMessage({ id: 'ui-data-export.selectMappingProfile' })}
                    fullWidth
                    required
                  />
                </div>
                <div data-test-job-profile-form-protocol>
                  <Field
                    label={<FormattedMessage id="ui-data-export.protocol" />}
                    name="protocol"
                    id="job-profile-protocol"
                    component={Select}
                    dataOptions={[]}
                    fullWidth
                  />
                </div>
                <div data-test-job-profile-description>
                  <Field
                    label={<FormattedMessage id="ui-data-export.description" />}
                    name="description"
                    id="job-profile-description"
                    component={TextArea}
                    fullWidth
                  />
                </div>
              </div>
            )}
          </FullScreenForm>
        </Layer>
      )}
    </FormattedMessage>
  );
};

JobProfilesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  mappingProfiles: PropTypes.arrayOf(PropTypes.object),
  hasLoaded: PropTypes.bool,
};

JobProfilesForm.defaultProps = {
  onCancel: noop,
  hasLoaded: false,
  mappingProfiles: [],
};

export default stripesFinalForm({
  validate,
  subscription: { values: true },
})(JobProfilesForm);
