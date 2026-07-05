# Hirely — Job Portal Frontend

A production-quality React 19 frontend for a MERN job portal, built with Vite,
Tailwind CSS v4, React Router, Axios, React Hook Form, and React Hot Toast.

## Getting started

```bash
npm install
npm run dev
```

The app expects the backend to be running at `http://localhost:5000/api`
(see `.env.example` — copy it to `.env` to override the API base URL).

```bash
cp .env.example .env
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — build for production
- `npm run preview` — preview the production build

## Structure

See `src/` for the full folder structure: `components/`, `pages/`, `routes/`,
`services/`, `context/`, `hooks/`, and `layout/`. Route guards live in
`src/routes/` (`ProtectedRoute`, `EmployerRoute`, `PublicRoute`), and all API
calls are centralized in `src/services/`.

## Roles

- **Visitor** — browse jobs, view details, must log in to apply.
- **JobSeeker** — apply to jobs, track applications, withdraw pending/reviewed ones.
- **JobProvider** — post/edit/delete jobs, view applicants, update application status.
