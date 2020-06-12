import { interactor } from '@bigtest/interactor';

import KeyValueInteractor from '@folio/stripes-components/lib/KeyValue/tests/interactor';

@interactor
export class SummaryContentInteractor {
  defaultScope = '#mapping-profile-details';

  name = new KeyValueInteractor('[data-test-mapping-profile-name]');
  description = new KeyValueInteractor('[data-test-mapping-profile-description]');
  recordType = new KeyValueInteractor('[data-test-mapping-profile-folio-record-type]');
  outputFormat = new KeyValueInteractor('[data-test-mapping-profile-output-format]');
}
