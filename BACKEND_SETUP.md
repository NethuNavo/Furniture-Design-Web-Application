# Simple Backend Setup For Nord Living

This is a very small backend setup for your HCI project.

It uses:
- `Next.js API routes`
- `Prisma`
- `MySQL`

You do **not** need a separate backend project.

## 1. Install MySQL

Use any one of these:
- MySQL Community Server
- XAMPP
- WAMP
- MySQL Workbench with local server

If you already have MySQL, you can skip this.

## 2. Create a database

Open MySQL Workbench or MySQL command line and run:

```sql
CREATE DATABASE furnivision;
```

## 3. Create your local `.env`

In the project root, create a file named `.env`

Copy this:

```env
DATABASE_URL="mysql://root:password@localhost:3306/furnivision"
```

Change:
- `root` to your MySQL username
- `password` to your MySQL password

## 4. Generate Prisma client

Run:

```bash
npm run db:generate
```

## 5. Create database tables

Run:

```bash
npm run db:migrate -- --name init
```

This will:
- create the tables
- save the migration files

## 6. Start the app

Run:

```bash
npm run dev
```

## 7. Test the backend

Open:

```text
http://localhost:3000/api/health
```

You should see:

```json
{
  "ok": true,
  "message": "Nord Living backend is running."
}
```

## 8. Available starter API routes

### Signup

`POST /api/auth/signup`

Example body:

```json
{
  "fullName": "Janani Nethara",
  "email": "janani@gmail.com",
  "password": "123456"
}
```

### Login

`POST /api/auth/login`

Example body:

```json
{
  "email": "janani@gmail.com",
  "password": "123456"
}
```

### Save design

`POST /api/designs`

Example body:

```json
{
  "email": "janani@gmail.com",
  "title": "Living Room Draft",
  "roomWidth": 800,
  "roomHeight": 600,
  "roomShape": "rectangle",
  "wallColor": "#e8e6e3",
  "floorColor": "#f5f4f2",
  "itemCount": 2,
  "items": []
}
```

### Get designs

`GET /api/designs?email=janani@gmail.com`

## 9. What this backend currently stores

- users
- saved designs
- favorites table ready for later use

## 10. Important note

This backend is intentionally simple for an HCI/demo project.

It is good enough for:
- demonstrating database connection
- saving users
- saving designs
- showing backend integration

Later, if you want, the next upgrade would be:
- connect the frontend auth form to `/api/auth/login`
- connect saved designs to `/api/designs`
- move favorites from localStorage into MySQL
