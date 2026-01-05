// migrations/TIMESTAMP_create-table-user-album-likes.js

exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
  });

  // Add unique constraint
  pgm.addConstraint(
    'user_album_likes',
    'unique_user_id_and_album_id',
    'UNIQUE(user_id, album_id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
