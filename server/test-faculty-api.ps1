$uri = "http://localhost:5000/api/admin/faculty"
$filePath = "d:\AcademyWale\server\test-faculty.jpg"

# Create multipart form data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"firstName`"$LF",
    "Test Faculty Name",
    "--$boundary",
    "Content-Disposition: form-data; name=`"lastName`"$LF",
    "",
    "--$boundary", 
    "Content-Disposition: form-data; name=`"bio`"$LF",
    "This is a test faculty bio for testing the faculty addition functionality.",
    "--$boundary",
    "Content-Disposition: form-data; name=`"teaches`"$LF",
    "[`"CA`",`"CMA`"]",
    "--$boundary",
    "Content-Disposition: form-data; name=`"image`"; filename=`"test-faculty.jpg`"",
    "Content-Type: image/jpeg$LF",
    [System.IO.File]::ReadAllText($filePath),
    "--$boundary--$LF"
) -join $LF

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $bodyLines -ContentType "multipart/form-data; boundary=`"$boundary`""
    Write-Host "Success:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
}
catch {
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseText = $reader.ReadToEnd()
        Write-Host "Response: $responseText"
    }
}
