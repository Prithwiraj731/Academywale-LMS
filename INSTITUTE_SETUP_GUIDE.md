# Institute Management Setup Guide

## Overview

This guide explains how to set up and manage institutes in the AcademyWale system, including bulk importing all institutes with their images.

## 🏫 Available Institutes

The system includes 18 institutes with their corresponding images:

1. **Aaditya Jain Classes** - `aaditya_jain_classes.png`
2. **Arjun Chhabra Tutorial** - `arjun_chhabra_tutorial.png`
3. **Avinash Lala Classes** - `avinash_lala_classes.jpg`
4. **BB Virtuals** - `bb_virtuals.png`
5. **Bishnu Kedia Classes** - `bishnu_kedia_classes.png`
6. **CA Buddy** - `ca_buddy.png`
7. **CA Praveen Jindal** - `ca_praveen_jindal.png`
8. **COC Education** - `coc_education.png`
9. **Ekatvam** - `ekatvam.png`
10. **Gopal Bhoot Classes** - `gopal_bhoot_classes.gif`
11. **Harshad Jaju Classes** - `harshad_jaju_classes.png`
12. **Navin Classes** - `navin_classes.jpg`
13. **Nitin Guru Classes** - `nitin_guru_classes.png`
14. **Ranjan Periwal Classes** - `ranjan_periwal_classes.jpg`
15. **Shivangi Agarwal** - `shivangi_agarwal.png`
16. **Siddharth Agarrwal Classes** - `siddharth_agarrwal_classes.jpg`
17. **SJC Institute** - `sjc_institute.jpg`
18. **Yashwant Mangal Classes** - `yashwant_mangal_classes.avif`

## 🚀 Setup Instructions

### Step 1: Start the Server

1. Open a terminal/command prompt
2. Navigate to the server directory:
   ```bash
   cd e:\AcademyWale\server
   ```
3. Start the server using one of these methods:
   - **Using the batch file**: `.\start-server.bat`
   - **Using Node.js directly**: `node app.js`
   - **Using npm**: `npm start`

### Step 2: Bulk Insert Institutes

Once the server is running, use the admin tools page to insert all institutes:

1. Open your browser and go to: `http://localhost:3000/admin-tools.html`
2. Click the **"📚 Bulk Insert All Institutes with Images"** button
3. Wait for the success confirmation

### Step 3: Verify Installation

1. Click the **"🔍 Check Current Institutes"** button to verify all institutes are loaded
2. You should see all 18 institutes listed with their image URLs

## 🔧 API Endpoints

### Get All Institutes

```
GET /api/institutes
```

Returns all institutes from the database with their image information.

### Bulk Insert Institutes (Admin Only)

```
POST /api/admin/institutes/bulk-insert
```

Clears existing institutes and inserts all 18 institutes with their images.

## 📁 File Structure

```
client/public/institutes/          # Institute images
├── aaditya_jain_classes.png
├── arjun_chhabra_tutorial.png
├── avinash_lala_classes.jpg
├── bb_virtuals.png
├── bishnu_kedia_classes.png
├── ca_buddy.png
├── ca_praveen_jindal.png
├── coc_education.png
├── ekatvam.png
├── gopal_bhoot_classes.gif
├── harshad_jaju_classes.png
├── navin_classes.jpg
├── nitin_guru_classes.png
├── ranjan_periwal_classes.jpg
├── shivangi_agarwal.png
├── siddharth_agarrwal_classes.jpg
├── sjc_institute.jpg
└── yashwant_mangal_classes.avif

server/src/model/Institute.model.js # Institute schema
server/app.js                       # API endpoints
client/src/pages/AdminDashboard.jsx # Admin interface
```

## 🐛 Troubleshooting

### Problem: Institutes not showing in admin dropdown

**Solution**:

1. Make sure the server is running
2. Use the admin tools page to bulk insert institutes
3. Check browser console for API errors
4. Verify the `/api/institutes` endpoint returns data

### Problem: Images not displaying

**Solution**:

1. Ensure all image files exist in `client/public/institutes/`
2. Check that the static file serving is configured correctly
3. Verify image URLs in the database match the actual file paths

### Problem: Server not starting

**Solution**:

1. Make sure Node.js is installed
2. Check that all dependencies are installed: `npm install`
3. Verify the database connection is working
4. Check the console for error messages

## 🎯 Testing

### Manual Testing

1. Open the admin tools page: `http://localhost:3000/admin-tools.html`
2. Use the buttons to test institute insertion and retrieval
3. Check the admin dashboard to see if institutes appear in dropdown
4. Create a test course with an institute to verify functionality

### Browser Console Testing

```javascript
// Open browser console and run:
testGetInstitutes(); // Check current institutes
testBulkInsert(); // Insert all institutes
```

## 📝 Notes

- The bulk insert endpoint clears existing institutes before inserting new ones
- All institutes include proper image URLs for display in the frontend
- The admin dashboard has fallback logic for hardcoded institutes if API fails
- Images are served statically from the `client/public/institutes/` directory

## 🔄 Integration with Admin Dashboard

After successful setup:

1. Admin dashboard dropdown will show all institutes
2. Institutes can be selected when creating courses
3. Institute detail pages will display proper images
4. The `/api/institutes` endpoint will return complete data
