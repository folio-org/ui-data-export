export const testUserOzzy = {
  firstName: 'Ozzy',
  lastName: 'Campenshtorm',
};

export const testUserElliot = {
  firstName: 'Elliot',
  lastName: 'Lane',
};

export const runningJobExecutions = [
  {
    id: 'de96f7a1-8706-42e9-ba86-c44c44592511',
    hrId: 3,
    jobProfileInfo: {
      id: '558dede0-515d-11e9-8647-d663bd873d93',
      name: 'default',
    },
    exportedFiles: [{
      fileId: '22fafcc3-f582-493d-88b0-3c538480cd80',
      fileName: 'EBOOKS1.mrc',
    }],
    runBy: {
      firstName: 'John',
      lastName: 'Doe',
    },
    progress: {
      current: 21650,
      total: 45265,
    },
    startedDate: '2020-01-27T10:10:18.743+0000',
    status: 'IN_PROGRESS',
    userId: '80328998-31a1-519f-a1b3-ba81f7ce6f8c',
  },
  { status: 'IN_PROGRESS' },
];

export const logJobExecutions = [
  {
    id: '67dfac11-1caf-4470-9ad1-d533f6360bdd',
    hrId: 2,
    jobProfileInfo: {
      id: '22fafcc3-f582-493d-88b0-3c538480cd83',
      name: 'default',
    },
    exportedFiles: [{
      fileId: '22fafcc3-f582-493d-88b0-3c538480cd83',
      fileName: 'import_28-20181105141034.mrc',
    }],
    progress: {
      current: 5,
      total: 512,
    },
    runBy: {
      firstName: testUserOzzy.firstName,
      lastName: testUserOzzy.lastName,
    },
    startedDate: '2018-11-05T14:22:57.000+0000',
    completedDate: '2018-11-11T14:10:34.000+0000',
    status: 'FAIL',
    userId: '12bbfdb5-91be-50ab-ad28-0d737fb5756a',
  },
  {
    id: '2e149aef-bb77-45aa-8a28-e139674b55e1',
    hrId: 4,
    jobProfileInfo: {
      id: '32fafcc3-f582-493d-88b0-3c538480cd83',
      name: 'default',
    },
    exportedFiles: [{
      fileId: '22fafcc3-f582-493d-88b0-3c538480cd83',
      fileName: 'exportQueryFile_21-20181105142257.mrc',
    }],
    progress: {
      current: 10,
      total: 5000,
    },
    runBy: {
      firstName: testUserElliot.firstName,
      lastName: testUserElliot.lastName,
    },
    completedDate: '2018-11-05T14:22:57.000+0000',
    startedDate: '2018-11-05T14:22:57.000+0000',
    status: 'SUCCESS',
    userId: '18bbfdb5-91be-50ab-ad28-0d737fb5758a',
  },
];

export default server => {
  [
    ...runningJobExecutions,
    ...logJobExecutions,
  ].forEach(jobExecution => server.create('job-execution', { ...jobExecution }));

  server.get('/data-export/jobExecutions', (schema, request) => {
    const { url } = request;
    const statuses = url.match(/status=\((?<statuses>.*)\)/).groups.statuses.split(' OR ');

    return schema.jobExecutions.where(jobExecution => statuses.includes(jobExecution.status));
  });
};
