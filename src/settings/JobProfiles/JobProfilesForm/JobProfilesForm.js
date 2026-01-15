import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { noop } from 'lodash';
import { Field } from 'react-final-form';

import { Layer, TextField, TextArea, Select, Checkbox, Layout } from '@folio/stripes/components';
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
    onCancel = noop,
    hasLoaded = false,
    mappingProfiles = [],
    hasLockPermissions,
    pristine,
    submitting,
    handleSubmit,
    paneTitle,
    metadata,
    headLine,
  } = props;

  const intl = useIntl();

  return (
    <Layer
      isOpen
      contentLabel={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.newProfile' })}
    >
      <FullScreenForm
        id="job-profiles-form"
        noValidate
        paneTitle={paneTitle}
        isSubmitButtonDisabled={pristine || submitting}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      >
        {!hasLoaded && <Preloader />}
        {hasLoaded && (
        <div className={css.jobProfilesFormContent}>
          {headLine}
          <div>{metadata}</div>
          <Layout className="flex flex-align-items-start full">
            <Layout className="full">
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
                  placeholder={intl.formatMessage({ id: 'ui-data-export.mappingProfiles.selectProfile' })}
                  fullWidth
                  required
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
            </Layout>
            <Layout className="margin-start-gutter" style={{ flexShrink: 0 }}>
              <div data-test-job-profile-locked>
                <Field
                  type="checkbox"
                  label={<FormattedMessage id="ui-data-export.locked" />}
                  vertical
                  name="locked"
                  id="mapping-profile-locked"
                  component={Checkbox}
                  disabled={!hasLockPermissions}
                />
              </div>
            </Layout>
          </Layout>
        </div>
        )}
      </FullScreenForm>
    </Layer>
  );
};

JobProfilesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  hasLockPermissions: PropTypes.bool,
  mappingProfiles: PropTypes.arrayOf(PropTypes.object),
  hasLoaded: PropTypes.bool,
  paneTitle: PropTypes.node.isRequired,
  metadata: PropTypes.node,
  headLine: PropTypes.node,
};

export default stripesFinalForm({
  validate,
  subscription: { values: true },
})(JobProfilesForm);
