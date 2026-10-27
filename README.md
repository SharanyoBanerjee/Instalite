# InstaLite

A lightweight Instagram-style REST API built with Express and Prisma (PostgreSQL).

## Features

- User management with CRUD operations, search, privacy filtering, and post counts
- Post management with CRUD operations, author association, location and date range filtering
- Like and unlike posts, fetch user likes and post likers
- Dynamic sorting and pagination on collection endpoints
- Database seeding with realistic sample data

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
npm install
```

### Environment Variables

Set `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Seed Database

```bash
npm run seed
```

### Run Server

```bash
npm start
```
