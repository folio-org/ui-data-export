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
  RunningJobsInteractor,
} from '../interactors';
import { runningJobExecutions } from '../network/scenarios/fetch-job-profiles-success';

const [runningJobExecution] = runningJobExecutions;

describe('Jobs lists', () => {
  const jobs = new JobsInteractor();
  const runningJobs = new RunningJobsInteractor();

  setupApplication({ scenarios: ['fetch-job-profiles-success'] });

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

    it('should display correct amount of running jobs', () => {
      expect(runningJobs.jobItemsAmount).to.equal(runningJobExecutions.length);
    });

    it('should display running job', () => {
      expect(runningJobs.jobItems(0).isPresent).to.be.true;
    });

    it('should display correct job profile name', () => {
      expect(runningJobs.jobItems(0).jobProfileName).to.equal(runningJobExecution.jobProfileInfo.name);
    });

    it('should display correct file name', () => {
      expect(runningJobs.jobItems(0).fileName).to.equal(runningJobExecution.exportedFiles[0].fileName);
    });

    it('should display correct human readable id', () => {
      expect(runningJobs.jobItems(0).hrId).to.equal(String(runningJobExecution.hrId));
    });

    it('should display correct triggered by name', () => {
      const {
        firstName,
        lastName,
      } = runningJobExecution.runBy;

      expect(runningJobs.jobItems(0).triggeredBy).to.equal(`Triggered by ${firstName} ${lastName}`);
    });

    it('should display job profile name', () => {
      expect(runningJobs.jobItems(0).jobProfileName).to.exist;
    });

    it('should display buttons', () => {
      expect(runningJobs.jobItems(0).buttons.isPresent).to.be.true;
      expect(runningJobs.jobItems(0).buttons.cancel.isPresent).to.be.true;
      expect(runningJobs.jobItems(0).buttons.pause.isPresent).to.be.true;
      expect(runningJobs.jobItems(0).buttons.resume.isPresent).to.be.true;
    });

    it('should apply correct translations to buttons', () => {
      expect(runningJobs.jobItems(0).buttons.cancel.text).to.equal(translation.cancel);
      expect(runningJobs.jobItems(0).buttons.pause.text).to.equal(translation.pause);
      expect(runningJobs.jobItems(0).buttons.resume.text).to.equal(translation.resume);
    });
  });
});
