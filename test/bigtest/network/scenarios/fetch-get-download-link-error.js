export default server => {
  server.get('/data-export/jobExecutions/:jobLogId/download/:fileId', {}, 404);
};
