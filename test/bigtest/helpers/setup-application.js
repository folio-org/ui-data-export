import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';
import dataTransferTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import { prefixKeys } from './prefixKeys';
import mirageOptions from '../network';

export function setupApplication({
  scenarios,
  hasAllPerms = true,
  translations,
} = {}) {
  setupStripesCore({
    mirageOptions,
    scenarios,
    stripesConfig: { hasAllPerms },
    translations: {
      ...translations,
      ...prefixKeys(dataTransferTranslations, 'stripes-data-transfer-components'),
    },
  });
}
