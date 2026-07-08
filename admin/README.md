# Admin Workspace

This folder contains a dedicated Admin client and server, isolated from the main user-facing app. It reuses existing logic while keeping admin-only features separate.

## Structure
- admin/client: React app for the admin panel
- admin/server: Express server exposing only admin-protected APIs

## Quick Start

### Admin Server
1) cd admin/server
2) Copy env.example to .env and set:
   - PORT=5050 (or any free port)
   - MONGODB_URI=your_mongodb_connection_string
   - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
3) npm install
4) npm run dev

### Admin Client
1) cd admin/client
2) Copy env.example to .env with VITE_API_URL=http://localhost:5050
3) npm install
4) npm run dev

## Login Credentials
- Email: admin@academywale.com
- Password: AdminAcademy12

Login at /admin. Admin cookie will secure APIs via requireAdminCookie middleware.

## Alternative: Use Main Server
If you prefer to use the main server instead of the separate admin server:

1) Start main server: cd server && npm run dev
2) Start admin client: cd admin/client && set VITE_API_URL=http://localhost:3000
3) Login at http://localhost:4175/admin
