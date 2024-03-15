import React from 'react';
import { FormattedMessage } from 'react-intl';

import css from './ProfilesLabel.css';

export const ProfilesLabel = () => {
  return (
    <div
      data-test-profile-label
      className={css.profilesLabel}
    >
      <FormattedMessage id="stripes-data-transfer-components.profiles" />
    </div>
  );
};
