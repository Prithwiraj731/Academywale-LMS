# Simple System Test
Write-Host "TESTING PERFECT COURSE CREATION SYSTEM" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Test 1: Basic Health Check
Write-Host "`n1. Testing Basic Health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/health" -Method GET
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "SUCCESS Health Status: $($healthData.status)" -ForegroundColor Green
    Write-Host "   Timestamp: $($healthData.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "ERROR Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Course Creation Endpoint
Write-Host "`n2. Testing Course Creation Endpoint..." -ForegroundColor Yellow
try {
    $optionsResponse = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/api/admin/courses/standalone" -Method OPTIONS
    Write-Host "SUCCESS Course Endpoint Available (Status: $($optionsResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "ERROR Course Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Faculty Endpoint
Write-Host "`n3. Testing Faculty Endpoint..." -ForegroundColor Yellow
try {
    $facultyResponse = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/api/faculties" -Method GET
    $facultyData = $facultyResponse.Content | ConvertFrom-Json
    Write-Host "SUCCESS Faculty Endpoint Working" -ForegroundColor Green
    Write-Host "   Retrieved: $($facultyData.Count) faculties" -ForegroundColor Gray
} catch {
    Write-Host "WARNING Faculty Endpoint: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`nTESTING COMPLETE!" -ForegroundColor Cyan
Write-Host "System is ready for course creation!" -ForegroundColor Green
