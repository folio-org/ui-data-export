export const errorLogs = [
  {
    id: '27d2ff0d-1020-4ccf-b39b-74fe09c90632',
    jobExecutionId: '83c24106-8c34-44d4-a5d1-62e684718735',
    createdDate: '2020-10-13T09:35:16.481+0000',
    logLevel: 'ERROR',
    reason: 'reason1',
  },
  {
    id: '5b04fa21-284e-4dbf-8c2e-9f5d3597841a',
    jobExecutionId: '83c24106-8c34-44d4-a5d1-62e684718735',
    createdDate: '2020-10-13T09:35:16.485+0000',
    logLevel: 'ERROR',
    reason: 'reason2',
  },
  {
    id: '77288642-2aa5-463f-8983-f0dc4c3cf9ae',
    jobExecutionId: '83c24106-8c34-44d4-a5d1-62e684718735',
    createdDate: '2020-10-13T09:35:16.484+0000',
    logLevel: 'ERROR',
    reason: 'reason3',
    affectedRecord: {
      id: '5bf370e0-8cca-4d9c-82e4-5170ab2a0a39',
      hrid: 'inst000000000022',
      title: 'A semantic web primer',
      recordType: 'INSTANCE',
      affectedRecords: [{
        id: 'e3ff6133-b9a2-4d4c-a1c9-dc1867d4df19',
        hrid: 'hold000000000009',
        recordType: 'HOLDINGS',
        affectedRecords: [{
          id: '100d10bf-2f06-4aa0-be15-0b95b2d9f9e3',
          hrid: 'item000000000015',
          recordType: 'ITEM',
          affectedRecords: [],
        }, {
          id: '7212ba6a-8dcf-45a1-be9a-ffaa847c4423',
          hrid: 'item000000000014',
          recordType: 'ITEM',
          affectedRecords: [],
        }],
      }],
    },
  },
];