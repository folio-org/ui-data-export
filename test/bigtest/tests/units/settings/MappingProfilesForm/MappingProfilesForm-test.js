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
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import { mountWithContext } from '@folio/stripes-data-transfer-components/interactors';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import translations from '../../../../../../translations/ui-data-export/en';
import { translationsProperties } from '../../../../helpers/translationsProperties';
import { MappingProfilesFormInteractor } from './interactors/MappingProfilesFormInteractor';
import { MappingProfilesFormContainer } from '../../../../../../src/settings/MappingProfiles/MappingProfilesFormContainer';

const initialValues = {
  recordTypes: [],
  outputFormat: 'MARC',
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

describe('MappingProfilesForm', () => {
  const form = new MappingProfilesFormInteractor();

  before(async () => {
    await cleanup();
  });

  describe('rendering mapping profiles form with stubbed submit handler', function () {
    const handleSubmitSpy = sinon.spy();

    beforeEach(async function () {
      handleSubmitSpy.resetHistory();

      await mountWithContext(
        <Paneset>
          <Router>
            <MappingProfilesFormContainer
              initialValues={initialValues}
              onSubmit={handleSubmitSpy}
              onCancel={noop}
            />
          </Router>
        </Paneset>,
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

    it('should display add transformation button', () => {
      expect(form.addTransformationButton.isPresent).to.be.true;
    });

    it('should display accordions set', () => {
      expect(form.accordions.isPresent).to.be.true;
    });

    it('should display correct accordion headers ', () => {
      expect(form.accordions.set(0).label).to.equal(translations.summary);
      expect(form.accordions.set(1).label).to.equal(translations.transformations);
    });

    it('should expand accordions by default ', () => {
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

    it('should display correct transformation fields headers', () => {
      expect(form.transformations.list.headers(1).text).to.equal(translations['mappingProfiles.transformations.fieldName']);
      expect(form.transformations.list.headers(2).text).to.equal(translations['mappingProfiles.transformations.transformation']);
    });

    it('should display correct transformation fields values', () => {
      expect(form.transformations.list.rows(0).cells(1).text).to.equal('Transformation field 1');
      expect(form.transformations.valuesFields(0).val).to.equal('Transformation value 1');
      expect(form.transformations.list.rows(1).cells(1).text).to.equal('Transformation field 2');
      expect(form.transformations.valuesFields(1).val).to.equal('');
    });

    it('should disable save button if there are not changes', () => {
      expect(form.fullScreen.submitButton.$root.disabled).to.be.true;
    });

    it('should display correct folio record types', () => {
      expect(form.summary.recordType.checkboxes(0).label).to.equal(commonTranslations['recordTypes.instance']);
      expect(form.summary.recordType.checkboxes(1).label).to.equal(commonTranslations['recordTypes.holdings']);
      expect(form.summary.recordType.checkboxes(2).label).to.equal(commonTranslations['recordTypes.item']);
    });

    it('should not mark fields as error by default', () => {
      expect(form.summary.name.hasErrorStyle).to.be.false;
      expect(form.summary.recordType.errorLabel).to.equal('');
    });

    describe('changing a field value', () => {
      beforeEach(async () => {
        await form.summary.description.fillAndBlur('value');
      });

      it('should enable save button if there are changes', () => {
        expect(form.fullScreen.submitButton.$root.disabled).to.be.false;
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

          describe('checking a record type', () => {
            beforeEach(async () => {
              await form.summary.recordType.checkboxes(2).clickInput();
            });

            it('should hide error message', () => {
              expect(form.summary.recordType.errorLabel).to.equal('');
            });

            describe('clicking on save button', () => {
              beforeEach(async () => {
                await form.fullScreen.submitButton.click();
              });

              it('should call submit handler', () => {
                expect(handleSubmitSpy.called).to.be.true;
              });
            });
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
        await form.addTransformationButton.click();
      });

      it('should open transformations modal', () => {
        expect(form.transformationsModal.isPresent).to.be.true;
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

  describe('rendering mapping profiles form with correct submit handler', function () {
    let result;
    const name = 'Profile name';
    const description = 'Description value';
    const transformationValue = 'Transformation value 2';

    beforeEach(async function () {
      await mountWithContext(
        <Paneset>
          <Router>
            <MappingProfilesFormContainer
              initialValues={initialValues}
              onSubmit={values => {
                result = values;
              }}
              onCancel={noop}
            />
          </Router>
        </Paneset>,
        translationsProperties,
      );
    });

    describe('filling form inputs and pressing submit', () => {
      beforeEach(async () => {
        await form.summary.name.fillAndBlur(name);
        await form.summary.recordType.checkboxes(2).clickInput();
        await form.summary.description.fillAndBlur(description);
        await form.transformations.valuesFields(1).fillAndBlur(transformationValue);
        await form.fullScreen.submitButton.click();
      });

      it('should fill data correctly', () => {
        expect(result.name).to.equal(name);
        expect(result.description).to.equal(description);
        expect(result.outputFormat).to.equal('MARC');
        expect(result.recordTypes).to.deep.equal([FOLIO_RECORD_TYPES.ITEM.type]);
        expect(result.transformations).to.deep.equal([
          initialValues.transformations[0],
          {
            ...initialValues.transformations[1],
            transformation: transformationValue,
          },
        ]);
      });
    });
  });
});
