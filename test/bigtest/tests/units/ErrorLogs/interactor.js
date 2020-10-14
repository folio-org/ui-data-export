import {
  scoped,
  interactor,
  collection,
  text,
  count,
} from '@bigtest/interactor';

@interactor
class ErrorLogInteractor {
  logInfo = text('[data-test-error-log-info]');
  affectedRecord = scoped('[data-test-error-log-affected-record]');
}

@interactor
class ErrorLogsInteractor {
  static defaultScope = '[data-test-error-logs-container]';

  logs = collection('[data-test-error-log]', ErrorLogInteractor);
  logsCount = count('[data-test-error-log]');
}

export const errorLogsInteractor = new ErrorLogsInteractor();
