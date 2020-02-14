import {
  interactor,
  text,
  scoped,
} from '@bigtest/interactor';

import RunningJobsControlButtonsInteractor from './RunningJobsControlButtonsInteractor';

@interactor
export class RunningJobInteractor {
  static defaultScope = '[data-test-running-job]';

  jobProfileName = text('[data-test-running-job-profile]');
  fileName = text('[data-test-running-job-file-name]');
  hrId = text('[data-test-running-job-hr-id]');
  status = text('[data-test-running-job-progress-status]');
  triggeredBy = text('[data-test-running-job-triggered-by]');
  buttons = scoped('[data-test-running-job-buttons-container]', RunningJobsControlButtonsInteractor);
  progressBar = scoped('[data-test-progress-bar]');

  whenLoaded() {
    return this.when(() => this.isPresent);
  }
}
