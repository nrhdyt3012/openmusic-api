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

      // Check if cover has hapi property
      if (!cover.hapi) {
        const response = h.response({
          status: 'fail',
          message: 'Format payload tidak valid',
        });
        response.code(400);
        return response;
      }

      // Validate image headers
      this._validator.validateImageHeaders(cover.hapi.headers);

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
      // Jika error dari validator atau service, throw ulang
      throw error;
    }
  }
}

module.exports = UploadsHandler;
