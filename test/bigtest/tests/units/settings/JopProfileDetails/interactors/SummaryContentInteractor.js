import { interactor } from '@bigtest/interactor';

import KeyValueInteractor from '@folio/stripes-components/lib/KeyValue/tests/interactor';

@interactor
export class SummaryContentInteractor {
  defaultScope = '#job-profile-details';

  name = new KeyValueInteractor('[data-test-job-profile-name]');
  mappingProfile = new KeyValueInteractor('[data-test-job-profile-mapping-profile]');
  protocol = new KeyValueInteractor('[data-test-job-profile-protocol]');
  description = new KeyValueInteractor('[data-test-job-profile-description]');
}
