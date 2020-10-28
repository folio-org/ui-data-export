import React from 'react';
import { render } from '@testing-library/react';

import { Harness } from '@folio/stripes-data-transfer-components/testUtils';

export const renderWithIntl = (children, translations = []) => render(
  <Harness translations={translations}>
    {children}
  </Harness>,
);
