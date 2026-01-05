// src/api/uploads/handler.js
const config = require('../../utils/config');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id } = request.params;

      // Check if cover exists
      if (!cover) {
        const response = h.response({
          status: 'fail',
          message: 'Cover tidak ditemukan',
        });
        response.code(400);
        return response;
      }

      // Validate image headers
      this._validator.validateImageHeaders(cover.hapi.headers);

      // Check file size
      const fileSize = cover.hapi.headers['content-length'];
      if (fileSize && parseInt(fileSize) > 512000) {
        const response = h.response({
          status: 'fail',
          message: 'Ukuran file terlalu besar. Maksimal 512KB',
        });
        response.code(413);
        return response;
      }

      // Write file
      const filename = await this._storageService.writeFile(cover, cover.hapi);
      const coverUrl = `http://${config.app.host}:${config.app.port}/upload/images/${filename}`;

      // Update album cover
      await this._albumsService.addAlbumCover(id, coverUrl);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
    } catch (error) {
      // Let error handler in server.js handle it
      throw error;
    }
  }
}

module.exports = UploadsHandler;
