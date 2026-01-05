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
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    // Check file size (max 512000 bytes = 512KB)
    if (cover._data.length > 512000) {
      const response = h.response({
        status: 'fail',
        message: 'Ukuran file terlalu besar. Maksimal 512KB',
      });
      response.code(413);
      return response;
    }

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/upload/images/${filename}`;

    await this._albumsService.addAlbumCover(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
