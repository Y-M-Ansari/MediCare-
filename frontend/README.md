# Medicare Frontend

This is the patient/doctor-facing React app for the Medicare project.

## Live Demo

- Patient / Doctor frontend: https://medicare-fend.netlify.app/

## Setup

Install dependencies and run the frontend from the `frontend/` folder:

```bash
cd frontend
npm install
npm run dev
```

## Environment

Create a `frontend/.env` file with:

```env
VITE_API_URL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## Notes

- The app uses Clerk for authentication and communicates with the backend API.
- Some code paths also default to `http://localhost:4000` when `VITE_API_URL` is not set.
