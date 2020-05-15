import { interactor } from '@bigtest/interactor';

import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';

import { FolioRecordTypeInteractor } from './FolioRecordTypeInteractor';

@interactor
export class SummaryContentInteractor {
  defaultScope = '#mapping-profiles-form';

  name = new TextFieldInteractor('[data-test-mapping-profile-form-name]');
  description = new TextAreaInteractor('[data-test-mapping-profile-description]');
  recordType = new FolioRecordTypeInteractor('[data-test-folio-record-type]');
  outputFormat = new SelectInteractor('[data-test-mapping-profile-output-format]');
}
