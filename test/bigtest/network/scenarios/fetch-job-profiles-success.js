export const sampleJobExecution = {
  id: 'de96f7a1-8706-42e9-ba86-c44c44592511',
  hrId: 3,
  jobProfileInfo: {
    id: '558dede0-515d-11e9-8647-d663bd873d93',
    name: 'default',
  },
  fileName: 'EBOOKS1.mrc',
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
};

export default server => {
  server.create('job-execution', { ...sampleJobExecution });
  server.createList('job-execution', 2);

  server.get('/data-export/jobExecutions', schema => schema.jobExecutions.all());
};
