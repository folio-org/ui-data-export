import {
  interactor,
  text,
  scoped,
  collection,
  count,
} from '@bigtest/interactor';

import { ProgressInteractor } from '@folio/stripes-data-transfer-components/interactors';

import RunningJobsControlButtonsInteractor from './RunningJobsControlButtonsInteractor';

@interactor
class JobInteractor {
  jobProfileName = text('[data-test-running-job-profile]');
  fileName = text('[data-test-running-job-file-name]');
  hrId = text('[data-test-running-job-hr-id]');
  status = text('[data-test-running-job-progress-status]');
  triggeredBy = text('[data-test-running-job-triggered-by]');
  buttons = scoped('[data-test-running-job-buttons-container]', RunningJobsControlButtonsInteractor);
  progress = scoped('[data-test-progress-bar]', ProgressInteractor);

  whenLoaded() {
    return this.when(() => this.isPresent);
  }
}

@interactor
export class RunningJobsInteractor {
  static defaultScope = '[data-test-running-jobs]';

  jobItems = collection('[data-test-job-item]', JobInteractor);
  jobItemsAmount = count('[data-test-job-item]');
}
