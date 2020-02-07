import {
  interactor,
  text,
  triggerable,
  Interactor,
  is,
} from '@bigtest/interactor';

@interactor class QueryFileUploaderInteractor {
  static defaultScope = '#ModuleContainer';

  title = text('[data-test-title]');
  subTitle = text('[data-test-sub-title]');
  uploaderBtn = new Interactor('[data-test-upload-btn]');
  secondaryArea = new Interactor('[data-test-secondary-area]');
  triggerDragEnter = triggerable('dragenter');
  triggerDragLeave = triggerable('dragleave');
  hasActiveClass = is('[class*="activeUpload---"]');
}

export const queryFileUploaderInteractor = new QueryFileUploaderInteractor('[class*="upload---"]');
