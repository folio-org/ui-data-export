export const runningJobExecutions = [
  {
    hrId: 0,
    jobProfileName: 'default',
    exportedFiles: [{ fileName: 'import-0.mrc' }],
    runBy: {
      firstName: 'John',
      lastName: 'Doe',
    },
    progress: {
      failed: 10,
      exported: 40,
      total: 100,
    },
    startedDate: '2020-01-27T10:10:18.743+0000',
    status: 'IN_PROGRESS',
  },
  {
    progress: {
      failed: 0,
      exported: 10,
      total: 100,
    },
    runBy: null,
    status: 'IN_PROGRESS',
    startedDate: '2020-01-27T10:09:18.743+0000',
  },
];

export const logJobExecutions = [
  {
    hrId: 2,
    exportedFiles: [{ fileName: 'import-1.mrc' }],
    progress: { total: 500 },
    runBy: {
      firstName: 'Ozzy',
      lastName: 'Campenshtorm',
    },
    startedDate: '2018-11-05T14:22:57.000+0000',
    completedDate: '2018-11-05T14:22:57.000+0000',
    status: 'FAIL',
  },
  {
    hrId: 3,
    exportedFiles: [{ fileName: 'import-2.mrc' }],
    progress: {
      exported: 4990,
      failed: 10,
      total: 5000,
    },
    runBy: {
      firstName: 'Elliot',
      lastName: 'Lane',
    },
    startedDate: '2018-11-05T14:22:57.000+0000',
    completedDate: '2018-11-11T14:10:34.000+0000',
    status: 'COMPLETED_WITH_ERRORS',
  },
  {
    hrId: 1,
    exportedFiles: [{ fileName: 'import-3.mrc' }],
    progress: {
      exported: 500,
      failed: 0,
      total: 500,
    },
    runBy: {
      firstName: 'John',
      lastName: 'Doe',
    },
    startedDate: '2018-11-04T14:22:57.000+0000',
    completedDate: '2018-11-04T14:10:34.000+0000',
    status: 'COMPLETED',
  },
];

export default server => {
  [
    ...runningJobExecutions,
    ...logJobExecutions,
  ].forEach(jobExecution => server.create('job-execution', { ...jobExecution }));

  server.get('/data-export/job-executions', (schema, request) => {
    const { url } = request;
    const statuses = decodeURIComponent(url).match(/status=\((?<statuses>.*)\)/).groups.statuses.split(' OR ');

    return schema.jobExecutions.where(jobExecution => statuses.includes(jobExecution.status));
  });
};
