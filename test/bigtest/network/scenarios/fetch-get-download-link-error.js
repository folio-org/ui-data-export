export default server => {
  server.get('/data-export/job-executions/:jobLogId/download/:fileId', {}, 404);
};
