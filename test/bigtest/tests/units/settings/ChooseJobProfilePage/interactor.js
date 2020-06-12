import { interactor } from '@bigtest/interactor';

import { SearchAndSortInteractor } from '@folio/stripes-data-transfer-components/interactors';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';

@interactor
export class ChooseJobProfileInteractor {
  jobProfiles = new SearchAndSortInteractor();
  confirmationModal = new ConfirmationModalInteractor('#choose-job-profile-confirmation-modal');
}
