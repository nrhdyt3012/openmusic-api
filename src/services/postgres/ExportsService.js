// src/services/postgres/ExportsService.js
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class ExportsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name
             FROM playlists 
             WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(queryPlaylist);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer 
             FROM songs 
             LEFT JOIN playlist_songs ON playlist_songs.song_id = songs.id 
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(querySongs);

    return {
      playlist: {
        ...playlistResult.rows[0],
        songs: songsResult.rows,
      },
    };
  }
}

module.exports = ExportsService;
