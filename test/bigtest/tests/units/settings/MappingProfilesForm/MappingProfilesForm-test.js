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
import sinon from 'sinon';

import { Paneset } from '@folio/stripes/components';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import {
  mountWithContext,
  wait,
} from '@folio/stripes-data-transfer-components/interactors';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import translations from '../../../../../../translations/ui-data-export/en';
import { getTotalSelectedMessage } from '../../../../helpers';
import {
  OverlayContainer,
  translationsProperties,
} from '../../../../../helpers';
import { MappingProfilesFormInteractor } from './interactors/MappingProfilesFormInteractor';
import { MappingProfilesFormContainer } from '../../../../../../src/settings/MappingProfiles/MappingProfilesFormContainer';

const initialValues = {
  recordTypes: [],
  outputFormat: 'MARC',
  transformations: [],
};

const allMappingProfileTransformations = [
  {
    displayName: 'Instances - Call number - prefix',
    transformation: 'Transformation value 1',
    recordType: 'INSTANCE',
    fieldId: 'fieldId1',
    path: 'fieldPath1',
  },
  {
    displayName: 'Items - Electronic access - Link text Items',
    recordType: 'ITEM',
    fieldId: 'fieldId2',
    path: 'fieldPath2',
  },
];

describe('MappingProfilesForm', () => {
  const form = new MappingProfilesFormInteractor();

  before(async () => {
    await cleanup();
  });

  describe('rendering mapping profiles form with stubbed submit handler', () => {
    const handleSubmitSpy = sinon.spy();
    const handleCloseSpy = sinon.spy();

    beforeEach(async () => {
      handleSubmitSpy.resetHistory();
      handleCloseSpy.resetHistory();

      await mountWithContext(
        <>
          <OverlayContainer />
          <Paneset>
            <Router>
              <MappingProfilesFormContainer
                allTransformations={allMappingProfileTransformations}
                contentLabel="Content label"
                initialValues={initialValues}
                onSubmit={handleSubmitSpy}
                onCancel={handleCloseSpy}
              />
            </Router>
          </Paneset>
        </>,
        translationsProperties,
      );
    });

    it('should display mapping profiles form', () => {
      expect(form.isPresent).to.be.true;
    });

    it('should display shared full screen form elements', () => {
      expect(form.fullScreen.isPresent).to.be.true;
    });

    it('should display correct pane title', () => {
      expect(form.fullScreen.header.text).to.equal(translations['mappingProfiles.newProfile']);
    });

    it('should display expand all button', () => {
      expect(form.expandAllButton.isPresent).to.be.true;
    });

    it('should display add transformations button with proper wording', () => {
      expect(form.addTransformationsButton.text).to.equal(translations['mappingProfiles.transformations.addTransformations']);
    });

    it('should display accordions set', () => {
      expect(form.accordions.isPresent).to.be.true;
    });

    it('should display correct accordion headers', () => {
      expect(form.accordions.set(0).label).to.equal(translations.summary);
      expect(form.accordions.set(1).label).to.equal(translations.transformations);
    });

    it('should expand accordions by default', () => {
      expect(form.accordions.set(0).isOpen).to.be.true;
      expect(form.accordions.set(1).isOpen).to.be.true;
    });

    it('should display summary section fields', () => {
      expect(form.summary.name.isPresent).to.be.true;
      expect(form.summary.description.isPresent).to.be.true;
      expect(form.summary.recordType.isPresent).to.be.true;
      expect(form.summary.outputFormat.isPresent).to.be.true;
    });

    it('should display correct summary fields labels', () => {
      expect(form.summary.name.label).to.equal(`${commonTranslations.name}*`);
      expect(form.summary.description.label).to.equal(translations.description);
      expect(form.summary.recordType.label).to.equal(`${commonTranslations.folioRecordType}*`);
      expect(form.summary.outputFormat.label).to.equal(`${translations.outputFormat}*`);
    });

    it('should not display empty transformation fields', () => {
      expect(form.transformations.isPresent).to.be.false;
    });

    it('should disable save button if there are no changes', () => {
      expect(form.fullScreen.submitButton.$root.disabled).to.be.true;
    });

    it('should display correct folio record types', () => {
      expect(form.summary.recordType.checkboxes(0).label).to.equal(commonTranslations['recordTypes.srs']);
      expect(form.summary.recordType.checkboxes(1).label).to.equal(translations['mappingProfiles.recordType.instance']);
      expect(form.summary.recordType.checkboxes(2).label).to.equal(commonTranslations['recordTypes.holdings']);
      expect(form.summary.recordType.checkboxes(3).label).to.equal(commonTranslations['recordTypes.item']);
    });

    it('should not mark fields as error by default', () => {
      expect(form.summary.name.hasErrorStyle).to.be.false;
      expect(form.summary.recordType.errorLabel).to.equal('');
    });

    describe('changing transformations field value', () => {
      beforeEach(async () => {
        await form.addTransformationsButton.click();
        await wait();
        await form.transformationsModal.transformations.checkboxes(0).clickInput();
        await form.transformationsModal.saveButton.click();
        await wait();
      });

      it('should enable submit button if there are changes in transformations', () => {
        expect(form.fullScreen.submitButton.$root.disabled).to.be.false;
      });

      describe('changing transformations value and return to default(empty)', () => {
        beforeEach(async () => {
          await form.addTransformationsButton.click();
          await wait();
          await form.transformationsModal.transformations.checkboxes(0).clickInput();
          await form.transformationsModal.saveButton.click();
          await wait();
        });

        it('should disable save button', () => {
          expect(form.fullScreen.submitButton.$root.disabled).to.be.true;
        });
      });
    });

    describe('changing a field value', () => {
      beforeEach(async () => {
        await form.summary.description.fillAndBlur('value');
      });

      it('should enable save button if there are changes', () => {
        expect(form.fullScreen.submitButton.$root.disabled).to.be.false;
      });

      describe('clicking on close button', () => {
        beforeEach(async () => {
          await form.fullScreen.closeButton.click();
        });

        it('should call close handler', () => {
          expect(handleCloseSpy.called).to.be.true;
        });
      });

      describe('clicking on cancel button', () => {
        beforeEach(async () => {
          await form.fullScreen.cancelButton.click();
        });

        it('should call close handler', () => {
          expect(handleCloseSpy.called).to.be.true;
        });
      });

      describe('clicking on save button', () => {
        beforeEach(async () => {
          await form.fullScreen.submitButton.click();
          await form.summary.name.blurInput();
        });

        it('should mark field as error and required', () => {
          expect(form.summary.name.hasErrorStyle).to.be.true;
        });

        it('should not call submit handler', () => {
          expect(handleSubmitSpy.called).to.be.false;
        });
      });

      describe('filling name', () => {
        beforeEach(async () => {
          await form.summary.name.fillAndBlur('mapping profile name');
        });

        describe('clicking on save button', () => {
          beforeEach(async () => {
            await form.fullScreen.submitButton.click();
          });

          it('should mark field as error and required', () => {
            expect(form.summary.recordType.errorLabel).to.equal(commonTranslations['validation.enterValue']);
          });

          it('should not call submit handler', () => {
            expect(handleSubmitSpy.called).to.be.false;
          });

          describe('checking a SRS record type', () => {
            beforeEach(async () => {
              await form.summary.recordType.checkboxes(0).clickInput();
            });

            it('should hide error message', () => {
              expect(form.summary.recordType.errorLabel).to.equal('');
            });

            it('should disable Instance record type', () => {
              expect(form.summary.recordType.checkboxes(1).isDisabled).to.be.true;
            });

            describe('clicking on save button', () => {
              beforeEach(async () => {
                await form.fullScreen.submitButton.click();
              });

              it('should not display record types mismatch message when no transformations are provided', () => {
                expect(form.summary.recordType.errorLabel).to.equal('');
              });

              describe('opening transformation modal', () => {
                beforeEach(async () => {
                  await form.addTransformationsButton.click();
                  await wait();
                });

                it('should disable Instance record type on transformation modal', () => {
                  expect(form.transformationsModal.searchForm.recordTypeFilters(0).isDisabled).to.be.true;
                });
              });

              describe('filling transformation which does not match the selected record type and submitting the form', () => {
                beforeEach(async () => {
                  await form.addTransformationsButton.click();
                  await wait();
                  await form.transformationsModal.transformations.valuesFields(0).fillAndBlur('Custom value');
                  await form.transformationsModal.transformations.checkboxes(0).clickInput();
                  await form.transformationsModal.saveButton.click();
                  await wait();
                  await form.fullScreen.submitButton.click();
                });

                it('should display record types mismatch message', () => {
                  expect(form.summary.recordType.errorLabel).to.equal(translations['mappingProfiles.validation.recordTypeMismatch']);
                });
              });
            });
          });
        });

        describe('checking an Instance record type', () => {
          beforeEach(async () => {
            await form.summary.recordType.checkboxes(0).clickInput();
          });

          it('should disable SRS record type', () => {
            expect(form.summary.recordType.checkboxes(1).isDisabled).to.be.true;
          });
        });

        describe('checking and unchecking record type', () => {
          beforeEach(async () => {
            await form.summary.recordType.checkboxes(2).clickInput();
            await form.summary.recordType.checkboxes(2).clickInput();
          });

          it('should mark field as error and required', () => {
            expect(form.summary.recordType.errorLabel).to.equal(commonTranslations['validation.enterValue']);
          });
        });
      });
    });

    describe('clicking on add transformation button', () => {
      beforeEach(async () => {
        await form.addTransformationsButton.click();
      });

      it('should open transformations modal', () => {
        expect(form.transformationsModal.isPresent).to.be.true;
      });

      describe('saving filled and checked transformation', () => {
        const callout = new CalloutInteractor();

        beforeEach(async () => {
          await form.transformationsModal.transformations.valuesFields(0).fillAndBlur('Custom value');
          await form.transformationsModal.transformations.checkboxes(0).clickInput();
          await form.transformationsModal.transformations.valuesFields(1).fillAndBlur('Custom value1');
          await form.transformationsModal.saveButton.click();
          await wait();
        });

        it('should display correct transformations table with filled values', () => {
          expect(form.transformations.headers(0).text).to.equal(translations['mappingProfiles.transformations.fieldName']);
          expect(form.transformations.headers(1).text).to.equal(translations['mappingProfiles.transformations.transformation']);
          expect(form.transformations.rows(0).cells(0).text).to.equal('Instances - Call number - prefix');
          expect(form.transformations.rows(0).cells(1).text).to.equal('Custom value');
        });

        it('should display success callout', () => {
          expect(callout.successCalloutIsPresent).to.be.true;
        });

        describe('reopening transformation modal', () => {
          beforeEach(async () => {
            await form.addTransformationsButton.click();
          });

          it('should display proper amount of found transformations', () => {
            expect(form.transformationsModal.resultsPane.header.sub).to.match(/2 fields/);
          });

          it('should display proper total selected count', () => {
            expect(form.transformationsModal.totalSelected.text).to.equal(getTotalSelectedMessage(translations, 1));
          });

          it('should display correct transformation fields values', () => {
            const { transformationsModal } = form;

            expect(transformationsModal.transformations.list.rows(0).cells(0).$('[data-test-select-field]').checked).to.be.true;
            expect(transformationsModal.transformations.list.rows(0).cells(1).text).to.equal('Instances - Call number - prefix');
            expect(transformationsModal.transformations.valuesFields(0).val).to.equal('Custom value');

            expect(transformationsModal.transformations.list.rows(1).cells(0).$('[data-test-select-field]').checked).to.be.false;
            expect(transformationsModal.transformations.list.rows(1).cells(1).text).to.equal('Items - Electronic access - Link text Items');
            expect(transformationsModal.transformations.valuesFields(1).val).to.equal('');
          });
        });
      });

      describe('clicking on cancel button', () => {
        beforeEach(async () => {
          await form.transformationsModal.cancelButton.click();
        });

        it('should close transformations modal', () => {
          expect(form.transformationsModal.isPresent).to.be.false;
        });
      });
    });
  });

  describe('rendering mapping profiles form with correct submit handler', () => {
    let result;
    const name = 'Profile name';
    const description = 'Description value';

    beforeEach(async () => {
      await mountWithContext(
        <>
          <OverlayContainer />
          <Paneset>
            <Router>
              <MappingProfilesFormContainer
                allTransformations={allMappingProfileTransformations}
                contentLabel="Content label"
                initialValues={initialValues}
                onSubmit={values => {
                  result = values;
                }}
                onCancel={noop}
              />
            </Router>
          </Paneset>
        </>,
        translationsProperties,
      );
    });

    describe('filling form inputs and pressing submit', () => {
      beforeEach(async () => {
        await form.summary.name.fillAndBlur(name);
        await form.summary.recordType.checkboxes(1).clickInput();
        await form.summary.description.fillAndBlur(description);
        await form.addTransformationsButton.click();
        await wait();
        await form.transformationsModal.transformations.valuesFields(0).fillAndBlur('Custom value');
        await form.transformationsModal.transformations.checkboxes(0).clickInput();
        await form.transformationsModal.saveButton.click();
        await wait();
        await form.fullScreen.submitButton.click();
      });

      it('should fill data correctly', () => {
        expect(result.name).to.equal(name);
        expect(result.description).to.equal(description);
        expect(result.outputFormat).to.equal('MARC');
        expect(result.recordTypes).to.deep.equal([FOLIO_RECORD_TYPES.INSTANCE.type]);
        expect(result.transformations).to.deep.equal([{
          enabled: true,
          fieldId: 'fieldId1',
          path: 'fieldPath1',
          recordType: 'INSTANCE',
          transformation: 'Custom value',
        }]);
      });
    });
  });
});
