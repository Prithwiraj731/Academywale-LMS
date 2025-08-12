# Simple Backend Test
Write-Host "=== BACKEND TESTING SCRIPT ===" -ForegroundColor Cyan

# Test 1: Basic Health
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/health" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Health: $($data.status)" -ForegroundColor Green
    Write-Host "   Timestamp: $($data.timestamp)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Health Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

# Test 2: Course Endpoint Options
Write-Host "`n2. Testing Course Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://academywale-lms.onrender.com/api/admin/courses/standalone" -Method OPTIONS
    Write-Host "✅ Course Endpoint: Status $($response.StatusCode)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Course Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan
