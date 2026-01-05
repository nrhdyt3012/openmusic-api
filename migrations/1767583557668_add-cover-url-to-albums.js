// migrations/TIMESTAMP_add-cover-url-to-albums.js

exports.up = (pgm) => {
  pgm.addColumn('albums', {
    cover_url: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'cover_url');
};
