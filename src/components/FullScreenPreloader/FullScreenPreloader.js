import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FullScreenView,
  Preloader,
} from '@folio/stripes-data-transfer-components';

export function FullScreenPreloader({
  isLoading,
  contentLabel,
  children,
  ...props
}) {
  if (!isLoading) {
    return children;
  }

  return (
    <FullScreenView
      contentLabel={contentLabel}
      {...props}
    >
      <Preloader />
    </FullScreenView>
  );
}

FullScreenPreloader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  contentLabel: PropTypes.node,
};

FullScreenPreloader.defaultProps = { contentLabel: <FormattedMessage id="stripes-data-transfer-components.loading" /> };
