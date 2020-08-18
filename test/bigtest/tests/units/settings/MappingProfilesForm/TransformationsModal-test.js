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
import { noop } from 'lodash';

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
      displayName: 'Instances - Call number - prefix',
      transformation: 'Transformation value 1',
      recordType: 'INSTANCE',
      path: 'field1',
      order: 0,
    },
    {
      displayName: 'Items - Electronic access - Link text Items',
      recordType: 'ITEM',
      path: 'field2',
      order: 1,
    },
    {
      displayName: 'Holdings - Effective call number',
      recordType: 'HOLDINGS',
      path: 'field3',
      order: 2,
    },
  ],
};

const totalSelectedMessage = selectedCount => {
  return translations['modal.totalSelected'].replace('{count}', selectedCount);
};

const foundFieldsAmountMessage = fieldsAmount => {
  if (fieldsAmount === 0) {
    return translations['mappingProfiles.transformations.emptyMessage'];
  }

  if (fieldsAmount === 1) {
    return '1 field found';
  }

  return `${fieldsAmount} fields found`;
};

describe('MappingProfilesTransformationsModal', () => {
  const modal = new TransformationsModalInteractor();
  let submitResult;

  before(async () => {
    await cleanup();
  });

  describe('rendering transformations modal', () => {
    beforeEach(async () => {
      await mountWithContext(
        <Router>
          <MappingProfilesTransformationsModal
            isOpen
            initialTransformationsValues={initialValues}
            onSubmit={selectedTransformations => { submitResult = selectedTransformations; }}
            onCancel={noop}
          />
        </Router>,
        translationsProperties,
      );
    });

    it('should display transformations modal', () => {
      expect(modal.isPresent).to.be.true;
    });

    it('should display search pane', () => {
      expect(modal.searchPane.isVisible).to.be.true;
      expect(modal.searchPane.header.title).to.equal(translations.searchAndFilter);
    });

    it('should display results pane', () => {
      expect(modal.resultsPane.isPresent).to.be.true;
      expect(modal.resultsPane.header.title).to.equal(translations.transformations);
      expect(modal.resultsPane.header.sub).to.equal(foundFieldsAmountMessage(initialValues.transformations.length));
    });

    it('should display total selected count', () => {
      expect(modal.totalSelected.text).to.equal(totalSelectedMessage(0));
    });

    it('should display search form', () => {
      expect(modal.searchForm.isPresent).to.be.true;
    });

    it('should display correct folio record types', () => {
      expect(modal.searchForm.recordTypeFilters(0).label).to.equal(commonTranslations['recordTypes.instance']);
      expect(modal.searchForm.recordTypeFilters(1).label).to.equal(commonTranslations['recordTypes.holdings']);
      expect(modal.searchForm.recordTypeFilters(2).label).to.equal(commonTranslations['recordTypes.item']);
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

    it('should display correct amount of transformation fields', () => {
      expect(modal.transformations.list.rowCount).to.equal(initialValues.transformations.length);
    });

    it('should display correct transformation fields headers', () => {
      expect(modal.transformations.list.headers(0).$('[data-test-select-all-fields]')).to.not.be.undefined;
      expect(modal.transformations.list.headers(1).text).to.equal(translations['mappingProfiles.transformations.fieldName']);
      expect(modal.transformations.list.headers(2).text).to.equal(translations['mappingProfiles.transformations.transformation']);
    });

    it('should display correct transformation fields values', () => {
      expect(modal.transformations.list.rows(0).cells(0).$('[data-test-select-field]')).to.not.be.undefined;
      expect(modal.transformations.list.rows(1).cells(0).$('[data-test-select-field]')).to.not.be.undefined;
      expect(modal.transformations.list.rows(0).cells(1).text).to.equal(initialValues.transformations[0].displayName);
      expect(modal.transformations.valuesFields(0).val).to.equal(initialValues.transformations[0].transformation);
      expect(modal.transformations.list.rows(1).cells(1).text).to.equal(initialValues.transformations[1].displayName);
      expect(modal.transformations.valuesFields(1).val).to.equal('');
    });

    describe('saving filled and checked transformation', () => {
      beforeEach(async () => {
        await modal.transformations.valuesFields(0).fillAndBlur('Custom value');
        await modal.transformations.checkboxes(0).clickInput();
        await modal.saveButton.click();
      });

      it('should insert information about selected transformations to callback', () => {
        expect(submitResult).to.deep.equal([{
          transformation: 'Custom value',
          recordType: 'INSTANCE',
          path: 'field1',
          enabled: true,
        }]);
      });
    });

    describe('clicking on collapse search pane button', () => {
      beforeEach(async () => {
        await modal.collapseSearchPaneButton.click();
      });

      it('should hide search pane', () => {
        expect(modal.searchPane.isVisible).to.be.false;
      });

      describe('clicking on expand search pane button', () => {
        beforeEach(async () => {
          await modal.expandSearchPaneButton.click();
        });

        it('should display the search pane', () => {
          expect(modal.searchPane.isVisible).to.be.true;
        });
      });
    });

    it('should not select transformations by default', () => {
      expect(modal.transformations.checkboxes(0).isChecked).to.be.false;
      expect(modal.transformations.checkboxes(1).isChecked).to.be.false;
      expect(modal.transformations.checkboxes(2).isChecked).to.be.false;
    });

    it('should not check select all checkbox by default', () => {
      expect(modal.transformations.selectAllCheckbox.isChecked).to.be.false;
    });

    describe('clicking on select all checkbox', () => {
      beforeEach(async () => {
        await modal.transformations.selectAllCheckbox.clickInput();
      });

      it('should select all transformations', () => {
        expect(modal.transformations.checkboxes(0).isChecked).to.be.true;
        expect(modal.transformations.checkboxes(1).isChecked).to.be.true;
        expect(modal.transformations.checkboxes(2).isChecked).to.be.true;
      });

      it('should check select all checkbox', () => {
        expect(modal.transformations.selectAllCheckbox.isChecked).to.be.true;
      });

      it('should update total selected count', () => {
        expect(modal.totalSelected.text).to.equal(totalSelectedMessage(3));
      });

      describe('clicking on checkbox from the first row', () => {
        beforeEach(async () => {
          await modal.transformations.checkboxes(0).clickInput();
        });

        it('should deselect the first item', () => {
          expect(modal.transformations.checkboxes(0).isChecked).to.be.false;
        });

        it('should uncheck select all checkbox', () => {
          expect(modal.transformations.selectAllCheckbox.isChecked).to.be.false;
        });

        it('should update total selected count', () => {
          expect(modal.totalSelected.text).to.equal(totalSelectedMessage(2));
        });

        describe('turning off certain record type filter - Instances', () => {
          beforeEach(async () => {
            await modal.searchForm.recordTypeFilters(0).clickAndBlur();
          });

          it('should display correct amount of transformation fields', () => {
            expect(modal.transformations.list.rowCount).to.equal(2);
          });

          it('should check select all checkbox', () => {
            expect(modal.transformations.selectAllCheckbox.isChecked).to.be.true;
          });
        });

        describe('clicking on select all checkbox', () => {
          beforeEach(async () => {
            await modal.transformations.selectAllCheckbox.clickInput();
          });

          it('should select all transformations (apply selection to unselected items)', () => {
            expect(modal.transformations.checkboxes(0).isChecked).to.be.true;
            expect(modal.transformations.checkboxes(1).isChecked).to.be.true;
            expect(modal.transformations.checkboxes(2).isChecked).to.be.true;
          });

          it('should check select all checkbox', () => {
            expect(modal.transformations.selectAllCheckbox.isChecked).to.be.true;
          });

          it('should update total selected count', () => {
            expect(modal.totalSelected.text).to.equal(totalSelectedMessage(3));
          });
        });
      });

      describe('clicking on select all checkbox', () => {
        beforeEach(async () => {
          await modal.transformations.selectAllCheckbox.clickInput();
        });

        it('should deselect all transformations', () => {
          expect(modal.transformations.checkboxes(0).isChecked).to.be.false;
          expect(modal.transformations.checkboxes(1).isChecked).to.be.false;
          expect(modal.transformations.checkboxes(2).isChecked).to.be.false;
        });

        it('should uncheck select all checkbox', () => {
          expect(modal.transformations.selectAllCheckbox.isChecked).to.be.false;
        });

        it('should update total selected count', () => {
          expect(modal.totalSelected.text).to.equal(totalSelectedMessage(0));
        });
      });

      describe('turning off certain record type filters', () => {
        beforeEach(async () => {
          await modal.searchForm.recordTypeFilters(0).clickAndBlur();
          await modal.searchForm.recordTypeFilters(1).clickAndBlur();
        });

        it('should display correct amount of transformation fields', () => {
          expect(modal.transformations.list.rowCount).to.equal(1);
          expect(modal.resultsPane.header.sub).to.equal(foundFieldsAmountMessage(1));
        });

        it('should filter out the transformation list', () => {
          expect(modal.transformations.list.rows(0).cells(1).text).to.equal(initialValues.transformations[1].displayName);
        });

        describe('clicking on select all checkbox', () => {
          beforeEach(async () => {
            await modal.transformations.selectAllCheckbox.clickInput();
          });

          it('should deselect all displayed transformations', () => {
            expect(modal.transformations.checkboxes(0).isChecked).to.be.false;
          });

          it('should uncheck select all checkbox', () => {
            expect(modal.transformations.selectAllCheckbox.isChecked).to.be.false;
          });

          it('should update total selected count', () => {
            expect(modal.totalSelected.text).to.equal(totalSelectedMessage(2));
          });
        });

        describe('turning on filters again', () => {
          beforeEach(async () => {
            await modal.searchForm.recordTypeFilters(0).clickAndBlur();
            await modal.searchForm.recordTypeFilters(1).clickAndBlur();
          });

          it('should display all transformation fields', () => {
            expect(modal.transformations.list.rowCount).to.equal(initialValues.transformations.length);
            expect(modal.resultsPane.header.sub).to.equal(foundFieldsAmountMessage(initialValues.transformations.length));
          });
        });
      });
    });

    describe('searching fields by non-empty search term', () => {
      beforeEach(async () => {
        await modal.searchForm.searchField.fillAndBlur('call');
        await modal.searchForm.submit();
      });

      it('should display correct amount of transformation fields', () => {
        expect(modal.transformations.list.rowCount).to.equal(2);
      });

      it('should display correct transformations', () => {
        expect(modal.transformations.list.rows(0).cells(1).text).to.equal(initialValues.transformations[0].displayName);
        expect(modal.transformations.list.rows(1).cells(1).text).to.equal(initialValues.transformations[2].displayName);
      });

      describe('applying filter', () => {
        beforeEach(async () => {
          await modal.searchForm.recordTypeFilters(0).clickAndBlur();
        });

        it('should make the filter unchecked', () => {
          expect(modal.searchForm.recordTypeFilters(0).isChecked).to.be.false;
        });

        it('should display correct amount of transformation fields', () => {
          expect(modal.transformations.list.rowCount).to.equal(1);
        });

        it('should display correct transformations', () => {
          expect(modal.transformations.list.rows(0).cells(1).text).to.equal(initialValues.transformations[2].displayName);
        });

        describe('clicking on reset search form button', () => {
          beforeEach(async () => {
            await modal.searchForm.resetButton.click();
          });

          it('should display all transformation fields', () => {
            expect(modal.transformations.list.rowCount).to.equal(initialValues.transformations.length);
            expect(modal.resultsPane.header.sub).to.equal(foundFieldsAmountMessage(initialValues.transformations.length));
          });

          it('should reset the form UI', () => {
            expect(modal.searchForm.searchField.val).to.equal('');
            expect(modal.searchForm.recordTypeFilters(0).isChecked).to.be.true;
          });
        });
      });
    });

    describe('searching fields by empty search term', () => {
      beforeEach(async () => {
        await modal.searchForm.searchField.fillAndBlur('');
        await modal.searchForm.submit();
      });

      it('should display all transformation fields', () => {
        expect(modal.transformations.list.rowCount).to.equal(initialValues.transformations.length);
        expect(modal.resultsPane.header.sub).to.equal(foundFieldsAmountMessage(initialValues.transformations.length));
      });
    });
  });
});
