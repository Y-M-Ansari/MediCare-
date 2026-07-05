# Medicare Admin Dashboard

This is the admin/doctor dashboard React app for the Medicare project.

## Live Demo

- Admin dashboard: https://medicare-adm.netlify.app/

## Setup

Install dependencies and run the admin app from the `admin/` folder:

```bash
cd admin
npm install
npm run dev
```

## Environment

Create an `admin/.env` file with:

```env
VITE_API_URL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Notes

- The admin app uses Clerk authentication and connects to the backend API.
