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
import { mountWithContext } from '@folio/stripes-data-transfer-components/interactors';
import commonTranslations from '@folio/stripes-data-transfer-components/translations/stripes-data-transfer-components/en';

import translations from '../../../../../../translations/ui-data-export/en';
import { translationsProperties } from '../../../../helpers/translationsProperties';
import { JobProfilesForm } from '../../../../../../src/settings/JobProfiles/JobProfilesForm';
import { JobProfilesFormInteractor } from './interactor';

describe('JobProfilesForm', () => {
  const mappingProfiles = [
    {
      value: 'id1',
      label: 'name1',
    },
    {
      value: 'id2',
      label: 'name2',
    },
  ];

  const form = new JobProfilesFormInteractor();

  before(async () => {
    await cleanup();
  });

  describe('rendering job profiles form with stubbed handlers and loaded mapping profiles', function () {
    const handleSubmitSpy = sinon.spy();
    const handleCancelSpy = sinon.spy();

    beforeEach(async function () {
      handleSubmitSpy.resetHistory();
      handleCancelSpy.resetHistory();

      await mountWithContext(
        <Paneset>
          <Router>
            <JobProfilesForm
              mappingProfiles={mappingProfiles}
              hasLoaded
              onSubmit={handleSubmitSpy}
              onCancel={handleCancelSpy}
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

    it('should not display preloader', () => {
      expect(form.preloader.isPresent).to.be.false;
    });

    it('should display correct pane title', () => {
      expect(form.fullScreen.header.text).to.equal(translations['jobProfiles.newProfile']);
    });

    it('should display input fields', () => {
      expect(form.name.isPresent).to.be.true;
      expect(form.description.isPresent).to.be.true;
      expect(form.mappingProfile.isPresent).to.be.true;
      expect(form.protocol.isPresent).to.be.true;
    });

    it('should display correct fields labels', () => {
      expect(form.name.label).to.equal(`${commonTranslations.name}*`);
      expect(form.description.label).to.equal(translations.description);
      expect(form.mappingProfile.label).to.equal(`${translations.mappingProfile}*`);
      expect(form.protocol.label).to.equal(translations.protocol);
    });

    it('should disable save button if there are not changes', () => {
      expect(form.fullScreen.submitButton.$root.disabled).to.be.true;
    });

    it('should not mark fields as error by default', () => {
      expect(form.name.hasErrorStyle).to.be.false;
      expect(form.mappingProfile.hasErrorStyle).to.be.false;
    });

    describe('changing a field value', () => {
      beforeEach(async () => {
        await form.description.fillAndBlur('value');
      });

      it('should enable save button if there are changes', () => {
        expect(form.fullScreen.submitButton.$root.disabled).to.be.false;
      });

      describe('clicking on save button', () => {
        beforeEach(async () => {
          await form.fullScreen.submitButton.click();
          await form.name.blurInput();
        });

        it('should mark field as error and required', () => {
          expect(form.name.hasErrorStyle).to.be.true;
        });

        it('should not call submit handler', () => {
          expect(handleSubmitSpy.called).to.be.false;
        });
      });

      describe('filling name', () => {
        beforeEach(async () => {
          await form.name.fillAndBlur('job profile name');
        });

        describe('clicking on save button', () => {
          beforeEach(async () => {
            await form.fullScreen.submitButton.click();
          });

          it('should mark field as error and required', () => {
            expect(form.mappingProfile.hasErrorStyle).to.be.true;
            expect(form.mappingProfile.errorText).to.equal(commonTranslations['validation.enterValue']);
          });

          it('should not call submit handler', () => {
            expect(handleSubmitSpy.called).to.be.false;
          });

          describe('selecting mapping profile', () => {
            beforeEach(async () => {
              await form.mappingProfile.selectOption('name1');
            });

            it('should hide error message', () => {
              expect(form.mappingProfile.hasErrorStyle).to.be.false;
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
      });
    });
  });

  describe('rendering job profiles form with not stubbed submit handler and loaded mapping profiles', function () {
    let result = {};
    const name = 'Profile name';
    const description = 'Description value';

    beforeEach(async function () {
      await mountWithContext(
        <Paneset>
          <Router>
            <JobProfilesForm
              mappingProfiles={mappingProfiles}
              hasLoaded
              onSubmit={values => { result = values; }}
              onCancel={noop}
            />
          </Router>
        </Paneset>,
        translationsProperties,
      );
    });

    describe('filling inputs and pressing submit', () => {
      beforeEach(async () => {
        await form.name.fillAndBlur(name);
        await form.description.fillAndBlur(description);
        await form.mappingProfile.selectOption('name1');
        await form.fullScreen.submitButton.click();
      });

      it('should fill data correctly', () => {
        expect(result.name).to.equal(name);
        expect(result.description).to.equal(description);
        expect(result.mappingProfileId).to.equal(mappingProfiles[0].value);
        expect(result.protocol).to.be.undefined;
      });
    });
  });

  describe('rendering job profiles with not loaded state', function () {
    beforeEach(async function () {
      await mountWithContext(
        <Paneset>
          <Router>
            <JobProfilesForm
              mappingProfiles={[]}
              hasLoaded={false}
              onSubmit={noop}
              onCancel={noop}
            />
          </Router>
        </Paneset>,
        translationsProperties,
      );
    });

    it('should display preloader', () => {
      expect(form.preloader.isPresent).to.be.true;
    });

    it('should not display input fields', () => {
      expect(form.name.isPresent).to.be.false;
      expect(form.description.isPresent).to.be.false;
      expect(form.mappingProfile.isPresent).to.be.false;
      expect(form.protocol.isPresent).to.be.false;
    });
  });
});
