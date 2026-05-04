# Notes App - File Upload Setup

## Quick Start with Docker Compose

The easiest way to run PostgreSQL and MinIO together:

```bash
# Start both services
docker-compose up -d

# Check status
docker-compose ps
```

PostgreSQL runs on `5432`, MinIO on `9000` (API) and `9001` (Console).

---

## Manual Setup (Without Docker Compose)

### 1. PostgreSQL

Ensure PostgreSQL is running on `localhost:5432` with:

- User: `postgres`
- Password: check `server/.env` (DB_PASS)
- Database: `pkm_system`

### 2. MinIO

Start MinIO locally:

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -v minio-data:/data \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

Or using Homebrew (macOS):

```bash
brew install minio/stable/minio
minio server ~/data --console-address :9001
```

---

## Backend Setup

```bash
cd server
npm install
npm start
```

The server will:

- Connect to PostgreSQL
- Initialize the `notes-files` bucket in MinIO
- Start on http://localhost:4040

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will run on http://localhost:5173

---

## MinIO Console

Access MinIO admin console at: **http://localhost:9001**

- Username: `minioadmin`
- Password: `minioadmin`

View uploaded files and bucket details there.

---

## Environment Variables

Server uses these MinIO defaults (in `server/.env`):

- `MINIO_ENDPOINT=localhost`
- `MINIO_PORT=9000`
- `MINIO_ACCESS_KEY=minioadmin`
- `MINIO_SECRET_KEY=minioadmin`
- `MINIO_BUCKET=notes-files`
- `MINIO_URL=http://localhost:9000`

Adjust if running MinIO on a different host/port.
