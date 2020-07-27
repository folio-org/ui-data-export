import stripesComponentsTranslations from '@folio/stripes-components/translations/stripes-components/en';

import translations from '../../../translations/ui-data-export/en';

export const translationsProperties = [
  {
    prefix: 'ui-data-export',
    translations,
  },
  {
    prefix: 'stripes-components',
    translations: stripesComponentsTranslations,
  },
  {
    prefix: 'stripes-smart-components',
    translations: {
      hideSearchPane: 'hideSearchPane',
      showSearchPane: 'showSearchPane',
      numberOfFilters: 'numberOfFilters',
    },
  },
];
