# Quick Test - AI Study Assistant
Write-Host "🧪 Testing AI Study Assistant on http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

# Test Login
Write-Host "Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "alex@student.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    if ($response.success) {
        Write-Host "✅ Login SUCCESS" -ForegroundColor Green
        Write-Host "   User: $($response.data.user.name)" -ForegroundColor Gray
        Write-Host "   Role: $($response.data.user.role)" -ForegroundColor Gray
        $token = $response.data.token
        Write-Host "   Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
        
        # Test Chat with token
        Write-Host ""
        Write-Host "Testing Chat Message..." -ForegroundColor Yellow
        $chatBody = @{
            message = "I need help with my homework"
        } | ConvertTo-Json
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        try {
            $chatResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/chat/message" `
                -Method POST `
                -Headers $headers `
                -Body $chatBody
            
            if ($chatResponse.success) {
                Write-Host "✅ Chat SUCCESS" -ForegroundColor Green
                Write-Host "   AI Response: $($chatResponse.data.response.Substring(0, 100))..." -ForegroundColor Gray
            } else {
                Write-Host "❌ Chat FAILED: $($chatResponse.error)" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ Chat ERROR: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Login FAILED: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Login ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Now test in browser: http://localhost:3001" -ForegroundColor Cyan
