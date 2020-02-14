import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translation from '../../../translations/ui-data-export/en';
import { setupApplication } from '../helpers';
import {
  JobsInteractor,
  RunningJobInteractor,
} from '../interactors';
import tempData from '../../../src/components/Jobs/RunningJobs/tempData';

describe('Jobs lists', () => {
  const runningJobData = tempData[0];
  const jobs = new JobsInteractor();
  const runningJob = new RunningJobInteractor();

  setupApplication();

  beforeEach(async function () {
    this.visit('/data-export');

    await jobs.whenLoaded();
  });

  it('should display jobs container', () => {
    expect(jobs.container.isPresent).to.be.true;
  });

  it('should display 1 jobs accordion', () => {
    expect(jobs.accordionsAmount).to.equal(1);
  });

  describe('rendering running jobs accordion', () => {
    it('should display running jobs with correct title firstly', () => {
      expect(jobs.accordions(0).title.isPresent).to.be.true;
      expect(jobs.accordions(0).title.text).to.equal(translation.runningJobs);
    });

    it('should display running job', () => {
      expect(runningJob.isPresent).to.be.true;
    });

    it('should display correct job profile name', () => {
      expect(runningJob.jobProfileName).to.equal(runningJobData.jobProfileInfo.name);
    });

    it('should display correct file name', () => {
      expect(runningJob.fileName).to.equal(runningJobData.fileName);
    });

    it('should display correct human readable id', () => {
      expect(runningJob.hrId).to.equal(String(runningJobData.hrId));
    });

    it('should display correct triggered by name', () => {
      const {
        firstName,
        lastName,
      } = runningJobData.runBy;

      expect(runningJob.triggeredBy).to.equal(`Triggered by ${firstName} ${lastName}`);
    });

    it('should display progress bar', () => {
      expect(runningJob.progressBar.isPresent).to.be.true;
    });

    it('should display buttons', () => {
      expect(runningJob.buttons.isPresent).to.be.true;
      expect(runningJob.buttons.cancel.isPresent).to.be.true;
      expect(runningJob.buttons.pause.isPresent).to.be.true;
      expect(runningJob.buttons.resume.isPresent).to.be.true;
    });

    it('should apply correct translations to buttons', () => {
      expect(runningJob.buttons.cancel.text).to.equal(translation.cancel);
      expect(runningJob.buttons.pause.text).to.equal(translation.pause);
      expect(runningJob.buttons.resume.text).to.equal(translation.resume);
    });
  });
});
