export const runningJobExecutions = [
  {
    hrId: 0,
    jobProfileInfo: { name: 'default' },
    exportedFiles: [{ fileName: 'import-0.mrc' }],
    runBy: {
      firstName: 'John',
      lastName: 'Doe',
    },
    startedDate: '2020-01-27T10:10:18.743+0000',
    status: 'IN_PROGRESS',
  },
  { status: 'IN_PROGRESS' },
];

export const logJobExecutions = [
  {
    hrId: 2,
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
    progress: {
      current: 10,
      total: 5000,
    },
    runBy: {
      firstName: 'Elliot',
      lastName: 'Lane',
    },
    startedDate: '2018-11-05T14:22:57.000+0000',
    completedDate: '2018-11-11T14:10:34.000+0000',
    status: 'SUCCESS',
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
