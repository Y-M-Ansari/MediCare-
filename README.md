# Medicare Full-Stack Project

## Overview

This repository contains a full-stack healthcare booking application with three primary parts:

- `backend/` - Express.js + MongoDB API server
- `frontend/` - Public patient-facing React app
- `admin/` - Admin/doctor dashboard React app

## Structure

- `backend/`
  - `index.js` - API server entry point
  - `config/db.js` - MongoDB connection helper
  - `controllers/` - Route business logic
  - `routes/` - Express routers
  - `models/` - Mongoose data models
  - `middlewares/` - Auth and request middleware
  - `utils/` - Cloudinary integration

- `frontend/`
  - Patient-facing website built with React + Vite
  - Uses Clerk for authentication and Stripe for payments

- `admin/`
  - Admin/doctor dashboard built with React + Vite
  - Uses Clerk for authentication and communicates with the backend API

## Install

Install dependencies separately in each package:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

## Run locally

Start each app in its own terminal:

```bash
cd backend
npm run dev

cd ../frontend
npm run dev

cd ../admin
npm run dev
```

## Environment Variables

### Backend

Create a `backend/.env` file with at least:

```env
MY_DATABASE_URL=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/your-db-name
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
MAJOR_ADMIN_ID=<optional_clerk_admin_user_id>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=4000
```

### Frontend

Create a `frontend/.env` file with:

```env
VITE_API_URL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Admin

Create an `admin/.env` file with:

```env
VITE_API_URL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Notes

- The backend currently uses `@clerk/express` and expects Clerk auth tokens from the frontend/admin apps.
- `backend/package.json` includes `@clerk/clerk-react`, which is typically only needed for client-side apps. This dependency may be redundant in the backend package.
- There are debug `console.log` statements located in several frontend/admin files; these are not errors but may be removed before production.
- The `frontend` app falls back to `http://localhost:4000` for `VITE_API_URL` in some places, while `admin` expects the env value explicitly.

## Existing Package READMEs

- `frontend/README.md`
- `admin/README.md`

These are currently default Vite templates and can be updated later with more app-specific details.

## Recommended next steps

1. Add missing environment values to each `.env` file
2. Confirm MongoDB connection string and Clerk settings
3. Remove or clean up debug logs if needed
4. Run each app and validate the routes from frontend/admin to backend

## Validation

- No root `README.md` existed before this file.
- The workspace appears structurally sound with three separate install/run targets.
- No fatal syntax or package structure issues were found during this review.


## Live Demo Links

- Patient / Doctor frontend: https://medicare-fend.netlify.app/
- Admin dashboard: https://medicare-adm.netlify.app/