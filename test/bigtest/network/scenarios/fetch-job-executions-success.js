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
    id: 'c92c6c12-82fc-42b9-b445-c530f24582b9',
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
    id: '5d535173-0914-40c2-a9fa-96eea64ceed7',
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
    id: '1bd03301-d9d5-4e0e-bc04-aea8065a3f86',
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

export const jobProfilesList = [
  {
    'id': '56944b1c-f3f9-475b-bed0-7387c33620ce',
    'name': 'Default authority export job profile',
    'default': true,
    'destination': 'fileSystem',
    'description': 'Default authority job profile',
    'userInfo': {
      'firstName': 'System',
      'lastName': 'Process',
      'userName': 'system_process',
    },
    'mappingProfileId': '5d636597-a59d-4391-a270-4e79d5ba70e3',
    'metadata': {
      'createdDate': '2023-04-27T01:50:42.569+00:00',
      'updatedDate': '2023-04-27T01:50:42.569+00:00',
    },
  },
  {
    'id': '5e9835fc-0e51-44c8-8a47-f7b8fce35da7',
    'name': 'Default holdings export job profile',
    'default': true,
    'destination': 'fileSystem',
    'description': 'Default holdings job profile',
    'userInfo': {
      'firstName': 'System',
      'lastName': 'Process',
      'userName': 'system_process',
    },
    'mappingProfileId': '1ef7d0ac-f0a8-42b5-bbbb-c7e249009c13',
    'metadata': {
      'createdDate': '2023-04-27T01:50:42.572+00:00',
      'updatedDate': '2023-04-27T01:50:42.572+00:00',
    },
  },
  {
    'id': '6f7f3cd7-9f24-42eb-ae91-91af1cd54d0a',
    'name': 'Default instances export job profile',
    'default': true,
    'destination': 'fileSystem',
    'description': 'Default instances export job profile',
    'userInfo': {
      'firstName': 'System',
      'lastName': 'Process',
      'userName': 'system_process',
    },
    'mappingProfileId': '25d81cbe-9686-11ea-bb37-0242ac130002',
    'metadata': {
      'createdDate': '2023-04-27T01:50:42.565+00:00',
      'updatedDate': '2023-04-27T01:50:42.565+00:00',
    },
  },
];

export const relatedUsers = [
  {
    'userId': 'c20fba54-4215-4074-8cd7-1c7e6da77d79',
    'firstName': 'valery',
    'lastName': 'pilko',
  },
  {
    'userId': '63299600-37a3-59d7-a34d-a70344ec5618',
    'firstName': 'DIKU',
    'lastName': 'DIKU',
  },
  {
    'userId': '63299600-37a3-59d7-a34d-a70344ec5612',
    'firstName': 'DIKU',
    'lastName': 'DIKU',
  },
  {
    'userId': '63299600-37a3-59d7-a34d-a70344ec5619',
    'lastName': 'DIKU',
  },
  {
    'userId': '63299600-37a3-59d7-a34d-a70344ec561-',
    'firstName': 'DIKU',
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
