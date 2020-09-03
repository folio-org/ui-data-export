import React from 'react';
import { useIntl } from 'react-intl';
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
import { CalloutContext } from '@folio/stripes/core';
import {
  buildResources,
  buildMutator,
  mountWithContext,
} from '@folio/stripes-data-transfer-components/interactors';

import {
  mappingProfileWithTransformations as mappingProfile,
  allMappingProfilesTransformations,
  generateTransformationsWithDisplayName,
} from '../../../../network/scenarios/fetch-mapping-profiles-success';
import { translationsProperties } from '../../../../helpers/translationsProperties';
import { EditMappingProfileRouteComponent } from '../../../../../../src/settings/MappingProfiles/EditMappingProfileRoute';
import { EditMappingProfileRouteInteractor } from './interactors/EditMappingProfileRouteInteractor';
import translations from '../../../../../../translations/ui-data-export/en';

function EditMappingProfileRouteContainer({
  allTransformations = [],
  profile = mappingProfile,
  mutator = { PUT: noop },
  sendCallout = noop,
  onCancel = noop,
} = {}) {
  const intl = useIntl();

  return (
    <Router>
      <Paneset>
        <CalloutContext.Provider value={{ sendCallout }}>
          <EditMappingProfileRouteComponent
            contentLabel="Content label"
            allTransformations={generateTransformationsWithDisplayName(intl, allTransformations)}
            resources={buildResources({
              resourceName: 'mappingProfile',
              records: [profile],
            })}
            mutator={buildMutator({ mappingProfile: mutator })}
            onCancel={onCancel}
          />
        </CalloutContext.Provider>
      </Paneset>
    </Router>
  );
}

describe('EditMappingProfileRoute', () => {
  const editMappingProfileRoute = new EditMappingProfileRouteInteractor();

  before(async () => {
    await cleanup();
  });

  describe('rendering edit mapping profile page without profile data', () => {
    beforeEach(async () => {
      await mountWithContext(
        <EditMappingProfileRouteContainer profile={null} />,
        translationsProperties,
      );
    });

    it('should display preloader', () => {
      expect(editMappingProfileRoute.preloader.isPresent).to.be.true;
    });
  });

  describe('rendering edit mapping profile page with profile data: success scenario', () => {
    const handleSubmitSpy = sinon.stub().callsFake(Promise.resolve);
    const handleCancelSpy = sinon.spy();
    const sendCalloutStub = sinon.spy();

    beforeEach(async () => {
      sinon.resetHistory();

      await mountWithContext(
        <EditMappingProfileRouteContainer
          allTransformations={allMappingProfilesTransformations}
          mutator={{ PUT: handleSubmitSpy }}
          sendCallout={sendCalloutStub}
          onCancel={handleCancelSpy}
        />,
        translationsProperties,
      );
    });

    it('should display the form', () => {
      expect(editMappingProfileRoute.form.isPresent).to.be.true;
    });

    it('should display shared full screen form elements', () => {
      expect(editMappingProfileRoute.form.fullScreen.isPresent).to.be.true;
    });

    it('should display correct pane title', () => {
      expect(editMappingProfileRoute.form.fullScreen.header.text).to.equal(mappingProfile.name);
    });

    it('should have correct name field value', () => {
      expect(editMappingProfileRoute.form.summary.name.val).to.equal(mappingProfile.name);
    });

    it('should have correct folio record types field value', () => {
      expect(editMappingProfileRoute.form.summary.recordType.checkboxes(0).isChecked).to.be.false;
      expect(editMappingProfileRoute.form.summary.recordType.checkboxes(1).isChecked).to.be.true;
      expect(editMappingProfileRoute.form.summary.recordType.checkboxes(2).isChecked).to.be.false;
    });

    it('should have correct description field value', () => {
      expect(editMappingProfileRoute.form.summary.description.val).to.equal(mappingProfile.description);
    });

    it('should disable save button if there are not changes', () => {
      expect(editMappingProfileRoute.form.fullScreen.submitButton.$root.disabled).to.be.true;
    });

    it('should display correct transformations table with filled values', () => {
      const { transformations } = editMappingProfileRoute.form;

      expect(transformations.headers(0).text).to.equal(translations['mappingProfiles.transformations.fieldName']);
      expect(editMappingProfileRoute.form.transformations.headers(1).text).to.equal(translations['mappingProfiles.transformations.transformation']);
      expect(transformations.rows(0).cells(0).text).to.equal('Holdings - Call number - Call number');
      expect(transformations.rows(0).cells(1).text).to.equal('$900 1');
      expect(transformations.rows(1).cells(0).text).to.equal('Holdings - Notes - Action note');
      expect(transformations.rows(1).cells(1).text).to.equal('$901 2');
      expect(transformations.rowCount).to.equal(mappingProfile.transformations.length);
    });

    describe('changing fields values', () => {
      beforeEach(async () => {
        await editMappingProfileRoute.form.summary.name.fillAndBlur('Changed name');
        await editMappingProfileRoute.form.summary.description.fillAndBlur('Changed description');
      });

      describe('submitting the form - success case', () => {
        beforeEach(async () => {
          await editMappingProfileRoute.form.fullScreen.submitButton.click();
        });

        it('should call submit callback with proper values', () => {
          expect(handleSubmitSpy.calledWith(sinon.match({
            id: mappingProfile.id,
            outputFormat: mappingProfile.outputFormat,
            transformations: sinon.match.array.deepEquals(mappingProfile.transformations),
            name: 'Changed name',
            description: 'Changed description',
            recordTypes: ['HOLDINGS'],
          }))).to.be.true;
        });

        it('should initiate displaying of success callout', () => {
          expect(sendCalloutStub.called).to.be.true;
          expect(sendCalloutStub.args[0].type).to.be.undefined;
        });

        it('should call cancel callback', () => {
          expect(handleCancelSpy.calledOnce).to.be.true;
        });
      });

      describe('submitting the form - error case', () => {
        beforeEach(async () => {
          handleSubmitSpy.callsFake(Promise.reject);
          await editMappingProfileRoute.form.fullScreen.submitButton.click();
        });

        it('should call submit callback', () => {
          expect(handleSubmitSpy.called).to.be.true;
        });

        it('should initiate displaying of error callout', () => {
          expect(sendCalloutStub.calledWith(sinon.match({ type: 'error' })));
        });

        it('should call cancel callback', () => {
          expect(handleCancelSpy.calledOnce).to.be.true;
        });
      });
    });

    describe('clicking on cancel button', () => {
      beforeEach(async () => {
        await editMappingProfileRoute.form.fullScreen.cancelButton.click();
      });

      it('should call cancel callback', () => {
        expect(handleCancelSpy.calledOnce).to.be.true;
      });
    });
  });
});
