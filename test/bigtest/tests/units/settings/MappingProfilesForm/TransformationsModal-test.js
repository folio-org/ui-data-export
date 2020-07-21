import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  describe,
  it,
  beforeEach,
  before,
} from '@bigtest/mocha';
import { cleanup } from '@bigtest/react';
import { expect } from 'chai';

import { mountWithContext } from '@folio/stripes-data-transfer-components/interactors';
import stripesComponentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import { MappingProfilesTransformationsModal } from '../../../../../../src/settings/MappingProfiles/MappingProfilesTransformationsModal';
import { translationsProperties } from '../../../../helpers/translationsProperties';
import { TransformationsModalInteractor } from './interactors/TransformationsModalInteractor';
import translations from '../../../../../../translations/ui-data-export/en';

const initialValues = {
  transformations: [
    {
      displayName: 'Transformation field 1',
      transformation: 'Transformation value 1',
      order: 0,
    },
    {
      displayName: 'Transformation field 2',
      order: 1,
    },
  ],
};

describe('MappingProfilesTransformationsModal', () => {
  const modal = new TransformationsModalInteractor();

  before(async () => {
    await cleanup();
  });

  describe('rendering mapping profiles form with stubbed submit handler', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Router>
          <MappingProfilesTransformationsModal
            isOpen
            initialTransformationsValues={initialValues}
          />
        </Router>,
        [...translationsProperties, {
          prefix: 'stripes-smart-components',
          translations: {
            hideSearchPane: 'hideSearchPane',
            showSearchPane: 'showSearchPane',
          },
        }],
      );
    });

    it('should display transformations modal', () => {
      expect(modal.isPresent).to.be.true;
    });

    it('should display search pane', () => {
      expect(modal.searchPane.isPresent).to.be.true;
      expect(modal.searchPane.$('[data-test-pane-header-title]').innerText).to.equal(translations.searchAndFilter);
    });

    it('should display results pane', () => {
      expect(modal.resultsPane.isPresent).to.be.true;
      expect(modal.resultsPane.$('[data-test-pane-header-title]').innerText).to.equal(translations.transformations);
      expect(modal.resultsPane.$('[data-test-pane-header-sub]').innerText).to.match(/\d+ fields found/);
    });

    it('should display filter accordions set', () => {
      expect(modal.filterAccordions.isPresent).to.be.true;
    });

    it('should display correct filter accordions headers', () => {
      expect(modal.filterAccordions.set(0).label).to.equal(translations.recordType);
    });

    it('should display total selected count', () => {
      expect(modal.totalSelected.text).to.equal('Total selected: 0');
    });

    it('should display search field', () => {
      expect(modal.searchField.isPresent).to.be.true;
    });

    it('should display correct folio record types', () => {
      expect(modal.recordTypeCheckboxes(0).label).to.equal(commonTranslations['recordTypes.instance']);
      expect(modal.recordTypeCheckboxes(1).label).to.equal(commonTranslations['recordTypes.holdings']);
      expect(modal.recordTypeCheckboxes(2).label).to.equal(commonTranslations['recordTypes.item']);
    });

    it('should display reset button', () => {
      expect(modal.resetButton.isPresent).to.be.true;
      expect(modal.resetButton.text).to.equal(translations.resetAll);
    });

    it('should display cancel button', () => {
      expect(modal.cancelButton.isPresent).to.be.true;
      expect(modal.cancelButton.text).to.equal(stripesComponentsTranslations.cancel);
    });

    it('should display save button', () => {
      expect(modal.saveButton.isPresent).to.be.true;
      expect(modal.saveButton.text).to.equal(stripesComponentsTranslations.saveAndClose);
    });

    it('should display collapse search pane button', () => {
      expect(modal.collapseSearchPaneButton.isPresent).to.be.true;
    });

    it('should not display expand search pane button', () => {
      expect(modal.expandSearchPaneButton.isPresent).to.be.false;
    });

    it('should display correct transformation fields headers', () => {
      expect(modal.transformations.list.headers(0).$('[data-test-select-all-fields]')).to.not.be.undefined;
      expect(modal.transformations.list.headers(1).text).to.equal(translations['mappingProfiles.transformations.fieldName']);
      expect(modal.transformations.list.headers(2).text).to.equal(translations['mappingProfiles.transformations.transformation']);
    });

    it('should display correct transformation fields values', () => {
      expect(modal.transformations.list.rows(0).cells(0).$('[data-test-select-field]')).to.not.be.undefined;
      expect(modal.transformations.list.rows(1).cells(0).$('[data-test-select-field]')).to.not.be.undefined;
      expect(modal.transformations.list.rows(0).cells(1).text).to.equal('Transformation field 1');
      expect(modal.transformations.valuesFields(0).val).to.equal('Transformation value 1');
      expect(modal.transformations.list.rows(1).cells(1).text).to.equal('Transformation field 2');
      expect(modal.transformations.valuesFields(1).val).to.equal('');
    });

    describe('clicking on collapse search pane button', () => {
      beforeEach(async () => {
        await modal.collapseSearchPaneButton.click();
      });

      it('should hide search pane', () => {
        expect(modal.searchPane.isPresent).to.be.false;
      });

      describe('clicking on expand search pane button', () => {
        beforeEach(async () => {
          await modal.expandSearchPaneButton.click();
        });

        it('should display the search pane', () => {
          expect(modal.searchPane.isPresent).to.be.true;
        });
      });
    });
  });
});
