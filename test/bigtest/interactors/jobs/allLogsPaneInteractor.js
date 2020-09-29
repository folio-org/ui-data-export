import { interactor } from '@bigtest/interactor';

@interactor class AllLogsPaneInteractor {
  static defaultScope = '#pane-results';
}

export const allLogsPaneInteractor = new AllLogsPaneInteractor();
