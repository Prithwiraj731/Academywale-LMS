Write-Host "🚨 FORCE DEPLOYING CORS FIX NOW! 🚨" -ForegroundColor Red
Write-Host ""

# Set git to not use pager
$env:GIT_PAGER = ""

Write-Host "📋 Adding app.js changes..." -ForegroundColor Blue
git add server/app.js

Write-Host "📋 Committing CORS fix..." -ForegroundColor Blue
git commit -m "FORCE CORS FIX - academywale-lms.onrender.com allowed"

Write-Host "📋 Pushing to trigger Render deployment..." -ForegroundColor Blue
git push origin main

Write-Host ""
Write-Host "✅ CORS fix deployed! Wait 2-3 minutes for Render to redeploy." -ForegroundColor Green
Write-Host ""
Write-Host "🧪 Test course creation again after deployment completes." -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue..."
