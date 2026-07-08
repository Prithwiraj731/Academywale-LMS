# AcademyWale Project Analysis

## 1. Executive Summary

AcademyWale is a MERN-style learning/course marketplace project for CA and CMA education. It contains:

- A public React/Vite frontend in `client/`.
- A Node.js/Express/MongoDB backend in `server/`.
- A newly separated admin workspace in `admin/`, with its own Vite client and Express server wrapper.
- Utility/debug scripts and spreadsheet source data at the repository root.

The application supports browsing courses by CA/CMA category, level, and paper; viewing faculties and institutes; managing courses, faculties, institutes, coupons, testimonials, and purchases; handling authentication; and sending notifications/contact emails.

The project is functional in concept, but it has several structural and security issues that should be addressed before production hardening. The most important issues are exposed secrets, duplicate course storage patterns, duplicated/overlapping API routes, inconsistent auth handling, and a large amount of debugging logic in production server code.

## 2. Project Structure

```text
AcademyWale/
|-- client/                  # Main user-facing React app
|-- server/                  # Main Express/MongoDB backend
|-- admin/                   # Separate admin workspace
|   |-- client/              # Admin Vite app reusing main admin pages
|   `-- server/              # Admin Express wrapper reusing main routes
|-- node_modules/            # Root installed dependencies
|-- .vercel/                 # Vercel metadata
|-- .vscode/                 # Editor settings
|-- *.xlsx                   # Source/business spreadsheets
|-- *.js                     # Debug, test, and data-normalization scripts
|-- package.json             # Root deployment/build scripts
|-- render.yaml              # Render deployment config
`-- *.md                     # Existing course visibility debug docs
```

Important root files:

- `package.json`: root scripts for server start and client build.
- `render.yaml`: Render deployment config for backend.
- `.env.example`: environment variable sample, but currently includes sensitive-looking values.
- `COURSE_VISIBILITY_DEBUG.md` and `UNIVERSAL_COURSE_VISIBILITY_FIX.md`: previous debugging notes around course filtering/visibility.
- `normalize_course_data.js`, `debug_course_visibility.js`, `create_test_cma_course.js`: database/data repair utilities.

## 3. Technology Stack

### Frontend

- React 19 in the main `client/` app.
- Vite 6 for development/build.
- React Router 7.
- Tailwind CSS.
- MUI, lucide-react, react-icons, framer-motion, GSAP, OGL, Cloudinary React SDK, EmailJS, QR code generation.

### Backend

- Node.js with Express 4.
- MongoDB via Mongoose.
- JWT authentication with bcrypt password hashing.
- Cloudinary for image uploads.
- Multer and multer-storage-cloudinary for upload handling.
- Nodemailer for notifications/contact flows.

### Admin Workspace

- `admin/client` uses React 18, Vite 5, React Router 6.
- `admin/server` is an ESM Express app that imports CommonJS route modules from the main `server/src/routes`.

### Deployment

- Root `package.json` suggests one deployment mode where `server/app.js` starts the backend and serves `client/dist`.
- `render.yaml` configures a Render web service with `rootDir: server`.
- `client/vercel.json` exists, indicating possible frontend deployment to Vercel.

## 4. Runtime Entry Points

### Main Client

Entry files:

- `client/src/main.jsx`
- `client/src/App.jsx`

The main app wraps routes with:

- `React.StrictMode`
- `AuthProvider`
- `BrowserRouter`

Main route groups include:

- Public pages: `/`, `/about`, `/contact`, `/privacy-policy`
- Course discovery: `/courses`, `/courses/all`
- Faculty/institute pages: `/faculties`, `/faculties/:slug`, `/institutes`, `/institutes/:slug`
- Auth pages: `/login`, `/register`
- User pages: `/student-dashboard`
- Admin pages: `/admin`, `/admin-dashboard`
- Payments: `/payment`, `/payment/:courseType/:courseId`
- Course detail pages: `/course/:courseType/:courseId`, `/course-details/:courseType/:courseId`
- CA/CMA paper overview and detail pages.

### Main Server

Entry file:

- `server/app.js`

Responsibilities:

- Loads environment variables.
- Configures CORS.
- Connects to MongoDB.
- Mounts modular route files.
- Defines many additional routes directly in `app.js`.
- Handles Cloudinary upload storage for courses/faculties.
- Serves the built React app from `client/dist`.
- Provides global API error handling.

### Admin Workspace

Admin client entry:

- `admin/client/src/main.jsx`

Admin server entry:

- `admin/server/src/index.js`

The admin server imports route modules from the main backend:

- `faculty.routes`
- `course.routes`
- `testimonial.routes`

This keeps the admin workspace small, but it also means the admin app is tightly coupled to the main backend's route internals.

## 5. Frontend Analysis

### Main UI Areas

The main client has pages for:

- Home and marketing sections.
- CA/CMA paper navigation.
- Course listing and course details.
- Faculty and institute browsing.
- Login/register.
- Student dashboard.
- Admin dashboard.
- Payment and UPI payment.

Reusable components are organized under:

- `client/src/components/layout`
- `client/src/components/home`
- `client/src/components/common`
- `client/src/components/admin`
- `client/src/components/ui`

### Static and Local Data

The project includes local data files:

- `client/src/data/papersData.js`: CA/CMA paper structure.
- `client/src/data/facultyList.js`
- `client/src/data/hardcodedFaculties.js`
- `client/src/data/testimonials.js`

This means some app behavior is hybrid: partly database-driven, partly hardcoded.

### API Access Pattern

API access is inconsistent across the frontend:

- Some code uses `client/src/api.js` and `API_URL`.
- Some code calls relative paths like `/api/contact`.
- Some code falls back to `http://localhost:5000`.
- Some code falls back to `https://academywale-lms.onrender.com`.
- Some pages retry multiple endpoint casing variations, especially paper detail pages.

This works around backend inconsistencies, but it increases maintenance cost and makes production behavior harder to reason about.

Recommended direction:

- Centralize API URL construction in one module.
- Use one environment variable, likely `VITE_API_URL`.
- Remove page-level fallback endpoint probing once backend routes are normalized.

## 6. Backend Architecture

### Route Organization

The backend uses both modular routes and direct route definitions in `server/app.js`.

Modular routes include:

- `auth.routes.js`
- `course.routes.js`
- `course-controller.routes.js`
- `courseDetail.routes.js`
- `courseSearch.routes.js`
- `faculty.routes.js`
- `institute.routes.js`
- `purchase.routes.js`
- `notify.routes.js`
- `coupon.routes.js`
- `contact.routes.js`
- `testimonial.routes.js`
- `standaloneCourse.routes.js`
- `image-migration.routes.js`

However, `server/app.js` also directly defines many routes for:

- Auth.
- Course creation.
- Course debugging.
- Course listing.
- Institute bulk insert.
- Standalone courses.
- Faculty info.
- Emergency delete operations.

This creates route duplication and makes endpoint behavior order-dependent.

### CORS Handling

CORS is configured globally, but several routes also manually set CORS headers. This indicates past cross-origin issues and makes behavior harder to audit.

Allowed origins include:

- `https://academywale.com`
- `https://www.academywale.com`
- `https://academywale-lms.onrender.com`
- Localhost ports `5173`, `5174`, and `3000`

Recommendation:

- Keep one shared CORS configuration.
- Avoid setting `Access-Control-Allow-Origin: *` on routes that also support credentials.

### Static Serving

The server serves:

```text
../client/dist
```

and falls back to `index.html` for non-API routes. This is suitable for single-service deployment after running the client build.

## 7. Data Model Analysis

### User

File:

- `server/src/model/User.model.js`

Fields:

- `name`
- `email`
- `password`
- `mobile`
- `role`
- `isActive`
- `createdAt`
- `lastLoginAt`

Password hashing is implemented with bcrypt in a pre-save hook.

Issue:

- Some auth code treats `mobile` as optional, while the schema requires it. This can cause signup failures depending on which route/controller handles the request.

### Faculty

File:

- `server/src/model/Faculty.model.js`

Fields:

- `firstName`
- `lastName`
- `bio`
- `teaches`
- `imageUrl`
- `image`
- `public_id`
- `slug`
- embedded `courses`

Embedded course fields include faculty name, subject, lectures, modes, pricing, category, subcategory, paper ID/name, institute, support data, and poster URL.

Important behavior:

- A pre-validation hook maps course mode values into allowed mode values using `modeMapper`.

### Course

File:

- `server/src/model/Course.model.js`

This is a separate top-level course collection with:

- course identity fields.
- CA/CMA hierarchy fields.
- faculty/institute fields.
- Cloudinary poster fields.
- `modeAttemptPricing`.
- legacy pricing fields.
- `isActive`.
- legacy `isStandalone`.

Important issue:

- The system stores course data both inside `Faculty.courses` and in the top-level `Course` collection. Some creation paths save to both. Some read paths merge both. This can create duplicates, stale records, and confusing update/delete behavior.

### Institute

File:

- `server/src/model/Institute.model.js`

Fields:

- `name`
- `imageUrl`
- `image`
- `public_id`
- embedded `courses`

The institute embedded course schema is less complete than the faculty embedded course schema. It lacks newer fields like category/subcategory/paper ID in the file reviewed, which can affect filtering if institute courses are expected to appear in paper-based results.

### Purchase

File:

- `server/src/model/Purchase.model.js`

Fields:

- `userId`
- `facultyId`
- `courseIndex`
- `courseDetails`
- `purchaseDate`
- `paymentStatus`
- `paymentMethod`
- `amount`
- `transactionId`
- `accessExpiry`
- `isActive`

Issue:

- Purchases identify courses by `facultyId` and `courseIndex`, which is fragile if faculty course arrays are reordered or courses are migrated to the top-level `Course` collection.

## 8. Course Data Flow

Course handling is the most complex part of the project.

### Creation

Course creation can happen through several endpoints:

- `/api/admin/courses`
- `/api/admin/courses/new`
- `/api/admin/courses/faculty`
- `/api/admin/courses/standalone`
- debug/test endpoints in `server/app.js`

Some paths:

- Add a course to `Faculty.courses`.
- Also create a top-level `Course` document "for better visibility".
- Parse `modeAttemptPricing` from JSON.
- Normalize category/subcategory/paper ID.
- Upload posters to Cloudinary.

### Reading

Course reads happen through:

- Faculty slug endpoints.
- Paper endpoints.
- Search endpoints.
- Detail endpoints.
- All courses endpoints.
- Standalone course endpoints.

The paper endpoint combines courses from:

- faculty embedded courses.
- institute embedded courses.
- top-level `Course` documents.

It then normalizes and filters by category, subcategory, and paper ID, with several fallback matching passes.

### Key Risk

Because course records can exist in multiple places, the same logical course may be returned more than once or may be updated/deleted in only one location.

Recommended direction:

- Choose one canonical course storage model.
- Prefer top-level `Course` documents with references to `Faculty` and `Institute`.
- Migrate embedded faculty/institute courses into the `Course` collection.
- Keep faculty and institute documents focused on profile data.

## 9. Authentication and Authorization

The project currently has multiple auth mechanisms:

### User JWT Auth

Implemented in:

- `server/src/controllers/auth.controller.js`
- `server/src/middlewares/auth.middleware.js`
- direct routes in `server/app.js`

JWT tokens are:

- Stored in HTTP-only cookies by `auth.controller.js`.
- Also returned in JSON and stored in `localStorage` by the frontend.

### Admin Cookie Auth

Implemented through:

- `requireAdminCookie` in `auth.middleware.js`
- Frontend login setting `adminAuthenticated=true` directly in `document.cookie`.

This is not strong authorization. Any user can set this cookie manually unless there is additional server-side verification elsewhere.

### Hardcoded Admin Credentials

`admin/README.md` documents:

- Email: `admin@academywale.com`
- Password: `AdminAcademy12`

Risk:

- Hardcoded admin credentials are unsafe for production and should be replaced by server-validated admin users.

Recommended direction:

- Use one auth system for users and admins.
- Protect admin APIs with JWT/session validation and role checks.
- Remove client-set `adminAuthenticated=true` as the authorization gate.
- Store secrets only in environment variables.

## 10. Security Findings

### Critical: Secrets in Repository

The following sensitive values are visible in repository files:

- MongoDB URI in `.env.example`.
- Cloudinary API key and API secret in `server/src/config/cloudinary.config.js`.
- Hardcoded JWT secrets such as `your-secret-key` in `server/app.js`.
- Admin credentials documented in `admin/README.md`.

Action required:

1. Rotate exposed MongoDB and Cloudinary credentials immediately.
2. Replace hardcoded credentials with environment variables.
3. Remove secrets from tracked files.
4. Add a `.gitignore` that excludes `.env`, `node_modules`, build output, logs, and local cache files.
5. Consider rewriting git history if this repository is public or shared.

### High: Weak Admin Protection

Admin APIs rely on a cookie that can be set by frontend JavaScript:

```text
adminAuthenticated=true
```

This should not be treated as secure authorization.

### High: Emergency/Delete Routes

Routes such as:

- `/emergency-delete-faculty`
- `/api/admin/courses/delete-all`

can perform destructive operations. They should be protected with strong admin auth, confirmation, audit logging, and ideally disabled in production.

### Medium: JWT Inconsistency

Some auth code uses `JWT_SECRET`; some direct server routes use literal strings. This can make tokens generated by one endpoint invalid in another.

### Medium: Excessive Logging

Many backend routes log request bodies, course data, user data, and debugging details. This can leak sensitive information in production logs.

## 11. Deployment Analysis

### Root Deployment

Root `package.json`:

- `start`: `node server/app.js`
- `build`: installs and builds the client.
- `postinstall`: runs the build.

This supports a deployment where the Express server serves the Vite build.

### Render Deployment

`render.yaml` sets:

- `rootDir: server`
- `buildCommand: npm install`
- `startCommand: node app.js`

Potential mismatch:

- If Render uses `rootDir: server`, the client build may not exist at `../client/dist` unless built separately or committed. The backend catch-all static serving expects that folder.

### Vercel Frontend

`client/vercel.json` exists, suggesting the frontend may be deployed separately. In that model, the backend should not need to serve the client build.

Recommendation:

- Decide on one deployment model:
  - Single service: backend builds and serves frontend.
  - Split services: frontend on Vercel, backend on Render.
- Align scripts, environment variables, and CORS to the chosen model.

## 12. Testing and Quality

Current testing appears mostly script/manual based:

- `test_api_endpoints.js`
- `server/test-api-endpoint.js`
- `server/test-endpoint.js`
- `server/test-fixed.js`
- `server/test_db_connection.js`
- Debug scripts for course visibility.

There is no clear automated test suite configured. `server/package.json` has:

```text
"test": "echo \"Error: no test specified\" && exit 1"
```

Recommended tests:

- Backend unit tests for controllers and utilities.
- Integration tests for course creation, course filtering, auth, and purchase flows.
- Frontend tests for route rendering and critical admin workflows.
- Smoke tests for deployment health and core API endpoints.

## 13. Code Quality Observations

### Positive Points

- The project has a clear business domain.
- Frontend routing covers a broad user journey.
- MongoDB schemas are defined for main entities.
- Cloudinary upload handling is integrated.
- There are utilities for data normalization and debugging.
- The admin split shows an attempt to isolate admin concerns.

### Issues to Improve

- `server/app.js` is too large and contains many responsibilities.
- Route definitions are duplicated between `app.js` and route modules.
- Debug endpoints and logs are mixed into production code.
- Several API paths have overlapping meanings.
- Auth behavior is split across direct routes and controller routes.
- Frontend pages contain endpoint fallback logic that belongs in backend/API normalization.
- Secrets are exposed.
- `node_modules` appears present in the workspace and there is no `.gitignore` visible.
- Some files are empty placeholders, such as `course-management-utility.html`, `delete-courses-utility.js`, and `tmp-fetch.js`.

## 14. Recommended Refactor Plan

### Phase 1: Security Cleanup

1. Rotate MongoDB and Cloudinary credentials.
2. Replace hardcoded secrets with environment variables.
3. Add `.gitignore`.
4. Remove secrets from examples.
5. Lock down admin APIs with real server-side auth.
6. Disable or protect emergency destructive endpoints.

### Phase 2: Backend Route Cleanup

1. Move direct `app.js` route handlers into route/controller modules.
2. Keep `app.js` focused on middleware, route mounting, static serving, and error handling.
3. Remove duplicate `/api/courses/all`, `/api/faculties`, and standalone route definitions.
4. Consolidate CORS into one middleware.
5. Remove production debug endpoints or guard them behind development-only checks.

### Phase 3: Data Model Normalization

1. Choose top-level `Course` collection as the canonical course source.
2. Add references to `Faculty` and `Institute`.
3. Migrate embedded courses into `Course`.
4. Update purchase records to reference stable course IDs instead of array indexes.
5. Remove fallback merge logic once migration is complete.

### Phase 4: Frontend API Cleanup

1. Centralize API calls in service modules.
2. Use consistent `VITE_API_URL`.
3. Remove per-page endpoint fallback probing.
4. Normalize image URL handling in one helper.
5. Separate admin client logic from user-facing pages if the admin workspace is retained.

### Phase 5: Testing and Deployment

1. Add backend integration tests.
2. Add frontend smoke tests.
3. Add a health-check script.
4. Decide on Render-only or Vercel+Render deployment.
5. Document local setup and deployment steps.

## 15. Suggested Future Folder Structure

```text
server/
|-- app.js                  # Express app setup only
|-- server.js               # Listen/start only
`-- src/
    |-- config/
    |-- controllers/
    |-- middlewares/
    |-- models/
    |-- routes/
    |-- services/
    |-- utils/
    `-- tests/

client/
`-- src/
    |-- api/                # API clients/services
    |-- assets/
    |-- components/
    |-- context/
    |-- data/
    |-- pages/
    |-- routes/
    `-- utils/

admin/
|-- client/
`-- server/                 # Optional, only if truly separate
```

## 16. Priority Checklist

### Must Fix Before Production

- Remove and rotate exposed credentials.
- Replace admin cookie gate with real server-side admin auth.
- Protect destructive endpoints.
- Standardize JWT secret usage.
- Add `.gitignore`.
- Remove hardcoded production secrets from code and examples.

### Should Fix Soon

- Consolidate duplicate course routes.
- Make top-level `Course` the canonical source.
- Remove debug endpoints from production.
- Standardize API base URL handling.
- Fix signup/mobile requirement mismatch.
- Fix Render/client build deployment mismatch.

### Nice to Have

- Add automated tests.
- Add API documentation.
- Add seed scripts for faculties/institutes/papers.
- Improve admin workspace independence.
- Add structured logging.
- Add validation schemas for request bodies.

## 17. Overall Assessment

AcademyWale has the foundation of a complete course marketplace: public browsing, course detail pages, faculty/institute management, admin workflows, uploads, authentication, and purchase tracking. The main challenge is not missing features; it is consistency and maintainability.

The project appears to have grown through urgent fixes around course visibility, which led to duplicate storage, fallback filtering, debug routes, and route-level patches. The best next step is to stabilize the architecture: secure the secrets, make course data canonical, simplify API routing, and turn the current debugging knowledge into tests.

Once those issues are handled, the codebase will be much easier to scale and safer to deploy.
