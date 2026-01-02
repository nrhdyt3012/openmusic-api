# OpenMusic API v1

API untuk aplikasi OpenMusic yang menyediakan pengelolaan album dan lagu.

## Instalasi

```bash
npm install
```

## Setup Database

1. Buat database PostgreSQL:

```bash
CREATE DATABASE openmusicdb;
```

2. Jalankan migrasi:

```bash
npm run migrate up
```

## Menjalankan Server

Development:

```bash
npm run start-dev
```

Production:

```bash
npm start
```

## Environment Variables

Buat file `.env` berdasarkan `.env.example`:

```
HOST=localhost
PORT=5000
PGUSER=developer
PGPASSWORD=supersecretpassword
PGDATABASE=openmusicdb
PGHOST=localhost
PGPORT=5432
```

## Endpoints

### Albums

- POST /albums
- GET /albums/{id}
- PUT /albums/{id}
- DELETE /albums/{id}

### Songs

- POST /songs
- GET /songs
- GET /songs/{id}
- PUT /songs/{id}
- DELETE /songs/{id}

## Query Parameters (Songs)

- title: Pencarian berdasarkan judul
- performer: Pencarian berdasarkan performer
