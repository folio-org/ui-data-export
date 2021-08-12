import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

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
  const intl = useIntl();

  if (!isLoading) {
    return children;
  }

  return (
    <FullScreenView
      contentLabel={contentLabel || intl.formatMessage({ id: 'stripes-data-transfer-components.loading' })}
      {...props}
      data-testid="preloader"
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
