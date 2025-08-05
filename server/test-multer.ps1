$uri = "http://localhost:5000/api/admin/faculty"
$filePath = "d:\AcademyWale\server\test-image-real.jpg"

# Use a simpler approach
try {
    $form = @{
        firstName = 'Test Faculty Name'
        lastName  = ''
        bio       = 'This is a test faculty bio.'
        teaches   = '["CA","CMA"]'
        image     = Get-Item $filePath
    }
    
    $response = Invoke-RestMethod -Uri $uri -Method Post -Form $form
    Write-Host "Success:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseText = $reader.ReadToEnd()
        Write-Host "Response: $responseText"
    }
}
