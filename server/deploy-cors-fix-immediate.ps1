Write-Host "🚨 IMMEDIATE CORS FIX DEPLOYMENT 🚨" -ForegroundColor Red
Write-Host ""
Write-Host "🔍 Problem: Frontend calling deployed backend with CORS errors" -ForegroundColor Yellow
Write-Host "🌐 Deployed URL: https://academywale-lms.onrender.com" -ForegroundColor Cyan
Write-Host "❌ Error: CORS header 'Access-Control-Allow-Origin' missing" -ForegroundColor Red
Write-Host ""
Write-Host "🛠️  Solution: Deploy CORS fixes to Render backend" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Step 1: Check current git status..." -ForegroundColor Blue
git status

Write-Host ""
Write-Host "📋 Step 2: Add all CORS fixes..." -ForegroundColor Blue
git add .

Write-Host ""
Write-Host "📋 Step 3: Commit CORS fixes..." -ForegroundColor Blue
git commit -m "🚨 IMMEDIATE CORS FIX: Add academywale-lms.onrender.com to allowed origins"

Write-Host ""
Write-Host "📋 Step 4: Push to trigger Render deployment..." -ForegroundColor Blue
git push origin main

Write-Host ""
Write-Host "✅ CORS fixes deployed! Render will automatically redeploy." -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Wait 2-3 minutes for deployment to complete..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🧪 Test the course creation again after deployment completes." -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue..."
