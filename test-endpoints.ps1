# Test script for AcademyWale endpoints
Write-Host "Testing AcademyWale Backend Endpoints..." -ForegroundColor Green

$baseUrl = "https://academywale.onrender.com"

# Test 1: Health endpoint
Write-Host "`n1. Testing /health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET -ContentType "application/json"
    Write-Host "✅ Health: " -NoNewline -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "❌ Health failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Simple test endpoint
Write-Host "`n2. Testing /test endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/test" -Method GET -ContentType "application/json"
    Write-Host "✅ Test: " -NoNewline -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Course test endpoint (POST)
Write-Host "`n3. Testing /api/test/course endpoint..." -ForegroundColor Yellow
try {
    $testData = @{
        courseName = "Test Course"
        courseType = "standalone"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test/course" -Method POST -Body $testData -ContentType "application/json"
    Write-Host "✅ Course Test: " -NoNewline -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "❌ Course Test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Faculties endpoint
Write-Host "`n4. Testing /api/faculties endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/faculties" -Method GET -ContentType "application/json"
    Write-Host "✅ Faculties count: $($response.faculties.Count)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Faculties failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Institutes endpoint
Write-Host "`n5. Testing /api/institutes endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/institutes" -Method GET -ContentType "application/json"
    Write-Host "✅ Institutes count: $($response.institutes.Count)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Institutes failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Green
Write-Host "Wait 2-3 minutes after deployment and run this script again if endpoints fail." -ForegroundColor Cyan
