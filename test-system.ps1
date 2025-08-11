# Test Course Creation with PowerShell
Write-Host "TESTING PERFECT COURSE CREATION SYSTEM" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Test 1: Basic Health Check
Write-Host "`n1. Testing Basic Health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/health" -Method GET
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "SUCCESS Health Status: $($healthData.status)" -ForegroundColor Green
    Write-Host "   Timestamp: $($healthData.timestamp)" -ForegroundColor Gray
    if ($healthData.cloudinary) {
        Write-Host "   Cloudinary: Configured SUCCESS" -ForegroundColor Green
        Write-Host "   Cloud Name: $($healthData.cloudinary.cloud_name)" -ForegroundColor Gray
    }
    if ($healthData.mongodb) {
        $mongoStatus = if ($healthData.mongodb.connected) { "Connected SUCCESS" } else { "Disconnected ERROR" }
        Write-Host "   MongoDB: $mongoStatus" -ForegroundColor $(if ($healthData.mongodb.connected) { "Green" } else { "Red" })
    }
}
catch {
    Write-Host "ERROR Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Database Health Check
Write-Host "`n2. Testing Database Health..." -ForegroundColor Yellow
try {
    $dbResponse = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/api/health/db" -Method GET
    $dbData = $dbResponse.Content | ConvertFrom-Json
    Write-Host "SUCCESS Database Status: $($dbData.status)" -ForegroundColor Green
    Write-Host "   Database: $($dbData.database)" -ForegroundColor Gray
    if ($dbData.collections) {
        Write-Host "   Collections:" -ForegroundColor Gray
        Write-Host "     - Courses: $($dbData.collections.courses)" -ForegroundColor Gray
        Write-Host "     - Faculties: $($dbData.collections.faculties)" -ForegroundColor Gray
        Write-Host "     - Users: $($dbData.collections.users)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "⚠️ Database Health Check: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 3: Course Creation Endpoint Availability
Write-Host "`n3️⃣ Testing Course Creation Endpoint..." -ForegroundColor Yellow
try {
    $optionsResponse = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/api/admin/courses/standalone" -Method OPTIONS
    Write-Host "✅ Course Endpoint Available (Status: $($optionsResponse.StatusCode))" -ForegroundColor Green
    $allowedMethods = $optionsResponse.Headers['access-control-allow-methods']
    if ($allowedMethods) {
        Write-Host "   Allowed Methods: $allowedMethods" -ForegroundColor Gray
    }
}
catch {
    Write-Host "❌ Course Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Faculty Endpoint
Write-Host "`n4️⃣ Testing Faculty Endpoint..." -ForegroundColor Yellow
try {
    $facultyResponse = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/api/faculties" -Method GET
    $facultyData = $facultyResponse.Content | ConvertFrom-Json
    Write-Host "✅ Faculty Endpoint Working" -ForegroundColor Green
    Write-Host "   Retrieved: $($facultyData.Count) faculties" -ForegroundColor Gray
}
catch {
    Write-Host "⚠️ Faculty Endpoint: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 5: Institute Endpoint
Write-Host "`n5️⃣ Testing Institute Endpoint..." -ForegroundColor Yellow
try {
    $instituteResponse = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/api/institutes" -Method GET
    $instituteData = $instituteResponse.Content | ConvertFrom-Json
    Write-Host "✅ Institute Endpoint Working" -ForegroundColor Green
    Write-Host "   Retrieved: $($instituteData.Count) institutes" -ForegroundColor Gray
}
catch {
    Write-Host "⚠️ Institute Endpoint: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🎯 TESTING COMPLETE!" -ForegroundColor Cyan
Write-Host "Ready for course creation with image upload!" -ForegroundColor Green

# Instructions for manual testing
Write-Host "`n📋 NEXT STEPS FOR MANUAL TESTING:" -ForegroundColor Magenta
Write-Host "1. Open the admin dashboard in your browser" -ForegroundColor White
Write-Host "2. Navigate to course creation section" -ForegroundColor White
Write-Host "3. Fill in course details:" -ForegroundColor White
Write-Host "   - Title: Test Perfect Course" -ForegroundColor Gray
Write-Host "   - Category: CA" -ForegroundColor Gray
Write-Host "   - Subcategory: Inter" -ForegroundColor Gray
Write-Host "   - Paper: Advanced Accounting" -ForegroundColor Gray
Write-Host "   - Upload an image file" -ForegroundColor Gray
Write-Host "4. Submit and verify:" -ForegroundColor White
Write-Host "   - Course creates successfully" -ForegroundColor Gray
Write-Host "   - Image uploads to Cloudinary" -ForegroundColor Gray
Write-Host "   - Data saves to MongoDB" -ForegroundColor Gray
Write-Host "   - Course appears in course list" -ForegroundColor Gray
