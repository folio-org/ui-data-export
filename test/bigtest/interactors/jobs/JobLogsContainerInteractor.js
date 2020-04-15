import {
  interactor,
  collection,
  Interactor,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

@interactor class JobLogsContainerInteractor {
  viewAllLogsButton = new Interactor('[data-test-view-all-logs-button]');
  logsList = new MultiColumnListInteractor('#job-logs-list');
  callout = new CalloutInteractor();
  fileNameBtns = collection('[data-test-download-file-btn]');
}

export const jobLogsContainerInteractor = new JobLogsContainerInteractor();
