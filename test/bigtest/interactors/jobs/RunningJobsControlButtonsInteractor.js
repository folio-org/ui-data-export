import {
  interactor,
  Interactor,
  scoped,
} from '@bigtest/interactor';

@interactor
export default class RunningJobsControlButtonsInteractor {
  static defaultScope = '[data-test-running-job-buttons-container]';

  cancel = scoped('[data-test-cancel-job-running]', Interactor);
  pause = scoped('[data-test-pause-job-running]', Interactor);
  resume = scoped('[data-test-resume-job-running]', Interactor);
}
