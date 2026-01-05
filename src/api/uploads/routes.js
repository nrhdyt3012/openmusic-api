// src/api/uploads/routes.js
const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: {
          output: 'stream',
        },
        maxBytes: 512000, // 512KB
        parse: true,
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../../upload'),
      },
    },
  },
];

module.exports = routes;
