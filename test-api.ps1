# API Testing Script for AI Study Assistant
# Run this to test all endpoints

Write-Host "🧪 Testing AI Study Assistant APIs" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Login
Write-Host "1️⃣  Testing Login..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"alex@student.com","password":"password123"}'

if ($loginResponse.success) {
    Write-Host "   ✅ Login successful!" -ForegroundColor Green
    $token = $loginResponse.data.token
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} else {
    Write-Host "   ❌ Login failed: $($loginResponse.error)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Get Student Profile
Write-Host "2️⃣  Testing Student Profile..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/student/profile" `
        -Method GET `
        -Headers $headers
    
    if ($profileResponse.success) {
        Write-Host "   ✅ Profile retrieved!" -ForegroundColor Green
        Write-Host "   Student: $($profileResponse.data.name) (Grade $($profileResponse.data.gradeLevel))" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Profile failed: $($profileResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Profile request failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Student Stats
Write-Host "3️⃣  Testing Student Stats..." -ForegroundColor Yellow
try {
    $statsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/student/stats" `
        -Method GET `
        -Headers $headers
    
    if ($statsResponse.success) {
        Write-Host "   ✅ Stats retrieved!" -ForegroundColor Green
        Write-Host "   Total Sessions: $($statsResponse.data.totalSessions)" -ForegroundColor Gray
        Write-Host "   Weekly Sessions: $($statsResponse.data.weeklySessions)" -ForegroundColor Gray
        Write-Host "   Streak Days: $($statsResponse.data.streakDays)" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Stats failed: $($statsResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Stats request failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: Send Chat Message
Write-Host "4️⃣  Testing Chat Message..." -ForegroundColor Yellow
try {
    $chatResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/chat/message" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body '{"message":"I need help staying focused on my homework"}'
    
    if ($chatResponse.success) {
        Write-Host "   ✅ Chat message sent!" -ForegroundColor Green
        Write-Host "   AI Response: $($chatResponse.data.response.Substring(0, 100))..." -ForegroundColor Gray
        if ($chatResponse.data.behaviorTags) {
            Write-Host "   Behavior Tags: $($chatResponse.data.behaviorTags -join ', ')" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ Chat failed: $($chatResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Chat request failed: $_" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Get Report History
Write-Host "5️⃣  Testing Report History..." -ForegroundColor Yellow
try {
    $reportsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/report/history" `
        -Method GET `
        -Headers $headers
    
    if ($reportsResponse.success) {
        Write-Host "   ✅ Reports retrieved!" -ForegroundColor Green
        Write-Host "   Total Reports: $($reportsResponse.data.Count)" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Reports failed: $($reportsResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Reports request failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 6: Generate Weekly Report
Write-Host "6️⃣  Testing Report Generation..." -ForegroundColor Yellow
Write-Host "   ⏳ This may take 10-15 seconds..." -ForegroundColor Gray
try {
    $generateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/report/generate" `
        -Method POST `
        -Headers $headers `
        -ContentType "application/json" `
        -Body '{"reportType":"WEEKLY"}'
    
    if ($generateResponse.success) {
        Write-Host "   ✅ Report generated!" -ForegroundColor Green
        Write-Host "   Summary: $($generateResponse.data.content.summary.Substring(0, 100))..." -ForegroundColor Gray
        Write-Host "   Sessions: $($generateResponse.data.content.metrics.totalChatSessions)" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Report generation failed: $($generateResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Report generation request failed: $_" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🎉 Testing Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Open http://localhost:3000 and test in browser" -ForegroundColor Yellow
