import { interactor } from '@bigtest/interactor';

import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import {
  FullScreenFormInteractor,
  PreloaderInteractor,
} from '@folio/stripes-data-transfer-components/interactors';

@interactor
export class JobProfilesFormInteractor {
  defaultScope = '#job-profiles-form';

  fullScreen = new FullScreenFormInteractor();
  name = new TextFieldInteractor('[data-test-job-profile-form-name]');
  description = new TextAreaInteractor('[data-test-job-profile-description]');
  mappingProfile = new SelectInteractor('[data-test-job-profile-form-mapping-profile]');
  protocol = new SelectInteractor('[data-test-job-profile-form-protocol]');
  preloader = new PreloaderInteractor();
}
