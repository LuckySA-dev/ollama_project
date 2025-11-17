# 🧪 Testing Guide - AI Study Assistant

## ⚠️ Current Status

Based on the logs, I can see:
- ✅ App started on **port 3001** (port 3000 was in use)
- ❌ **401 errors** on `/api/chat/message` - Authentication issue
- ✅ Other routes compiled successfully

## 🔍 Issues Identified from Logs

### Issue #1: 401 Unauthorized on Chat
```
POST /api/chat/message 401 in 290ms
POST /api/chat/message 401 in 14ms
```

**Cause**: The authentication fix I applied stores tokens in cookies, but the browser needs to be refreshed or cleared for the new code to take effect.

**Solution**: Clear browser data and re-login

---

## 🧪 Step-by-Step Testing

### Step 1: Verify Dev Server is Running

Check the terminal where you ran `npm run dev`. You should see:
```
✓ Ready in 2.1s
- Local: http://localhost:3001  ← Note the port!
```

If it crashed or stopped, restart it:
```bash
npm run dev
```

### Step 2: Open Browser

**Important**: Use the correct port from Step 1!

Open: **http://localhost:3001** (or whatever port it shows)

### Step 3: Clear Browser Data

**CRITICAL**: The old code stored tokens differently, so you MUST clear:

**Option A - DevTools**:
1. Press F12
2. Application tab
3. Click "Clear site data"
4. Refresh page

**Option B - Incognito**:
- Just use Incognito/Private mode (easier!)

### Step 4: Test Login

1. Click "Sign In"
2. Login with:
   - Email: `alex@student.com`
   - Password: `password123`
3. **Expected**: Redirect to `/student/dashboard`

**Check DevTools** (F12 → Application):
- Cookies → Should have `auth-token`
- Local Storage → Should have `auth-token` and `user`

### Step 5: Test Dashboard

You should see:
- ✅ Stats cards with numbers
- ✅ Navigation menu (Dashboard, Chat, Reports)
- ⚠️ Chart may be empty (normal for new users)

For Alex (has sample data):
- Total Sessions: ~5
- Focus Score: ~75
- Motivation: ~80
- Study Streak: ~3 days

### Step 6: Test Chat (CRITICAL)

1. Click "Chat" in navigation
2. Type: "I need help with my homework"
3. Click Send

**Expected Behavior**:
- Message appears immediately
- Loading indicator shows
- AI responds in 5-10 seconds
- Response appears in chat

**If it fails with 401**:
- Go back to Step 3 (clear browser data)
- Make sure you're logged in
- Check DevTools Console for errors

### Step 7: Test Reports

1. Click "Reports" in navigation
2. Click "Generate Weekly Report"

**Expected Behavior**:
- Button disables
- Wait 10-15 seconds
- Report card appears
- Shows summary and metrics

---

## 🐛 Troubleshooting

### Problem: 401 Unauthorized Errors

**Symptoms**:
- Chat doesn't work
- API calls fail
- Console shows "Unauthorized"

**Solutions**:
1. Clear browser data (most common fix)
2. Re-login
3. Check cookies exist (DevTools → Application → Cookies)
4. Check localStorage has token

### Problem: Chat Doesn't Respond

**Check**:
1. Is Ollama running?
   ```bash
   curl http://localhost:11434/api/tags
   ```
2. Browser console errors?
3. Network tab shows 200 or error?

**Fix**:
- If Ollama not running: `ollama serve`
- If 401: Clear browser data
- If 500: Check dev server terminal for errors

### Problem: Dashboard Shows N/A

**This is normal** for new users!
- Maria and Jordan have no data
- Only Alex has sample data

**To fix**: Use Alex's account or generate data by chatting

### Problem: Reports Fail

**Requirements**:
- Ollama must be running
- User must have chat history
- May take 10-15 seconds

**Check**:
- Browser console for errors
- Dev server terminal for errors
- Ollama status

---

## 📊 What to Look For

### Success Indicators ✅

**Login**:
- Redirects to dashboard
- No console errors
- Cookies and localStorage have tokens

**Dashboard**:
- Stats show numbers (not "N/A" for Alex)
- Chart renders
- Navigation works

**Chat**:
- Messages send
- AI responds
- No 401 errors

**Reports**:
- Generates successfully
- Shows summary
- Displays metrics

### Failure Indicators ❌

**401 Errors**:
- Need to clear browser data
- Re-login required

**500 Errors**:
- Check dev server terminal
- Check Ollama is running
- Database connection issue

**Blank Pages**:
- Check browser console
- Check Network tab
- Compilation error in dev server

---

## 🔧 Manual API Testing

If browser testing fails, test APIs directly:

### Test Login
```powershell
$body = @{
    email = "alex@student.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$response
```

### Test Chat (use token from login)
```powershell
$token = $response.data.token

$chatBody = @{
    message = "Help me study"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3001/api/chat/message" `
    -Method POST `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $chatBody
```

---

## 📝 Test Results Template

Fill this out as you test:

### Login Test
- [ ] Page loads
- [ ] Form submits
- [ ] Redirects to dashboard
- [ ] Cookies set
- [ ] localStorage set
- **Result**: ✅ / ❌
- **Notes**: 

### Dashboard Test
- [ ] Stats display
- [ ] Chart renders
- [ ] Navigation works
- **Result**: ✅ / ❌
- **Notes**: 

### Chat Test
- [ ] Interface loads
- [ ] Can send message
- [ ] AI responds
- [ ] No 401 errors
- **Result**: ✅ / ❌
- **Notes**: 

### Reports Test
- [ ] Page loads
- [ ] Can generate report
- [ ] Report displays
- **Result**: ✅ / ❌
- **Notes**: 

---

## 🎯 Quick Checklist

Before testing:
- [ ] Dev server running (`npm run dev`)
- [ ] PostgreSQL running (`docker ps`)
- [ ] Ollama running (`curl http://localhost:11434/api/tags`)
- [ ] Browser data cleared OR using Incognito
- [ ] Using correct port (check dev server output)

---

## 💡 Pro Tips

1. **Use Incognito mode** - Avoids cache issues
2. **Keep DevTools open** - See errors immediately
3. **Watch dev server terminal** - See backend errors
4. **Test with Alex first** - Has sample data
5. **Be patient with AI** - Takes 5-15 seconds to respond

---

## 🚨 Most Common Issues

1. **Wrong port** - Check dev server output for actual port
2. **Old tokens** - Clear browser data
3. **Ollama not running** - Start with `ollama serve`
4. **Database not running** - Start with `docker start postgres-study`

---

**Current App URL**: http://localhost:3001 (based on your logs)
**Test Account**: alex@student.com / password123
**Status**: Ready for testing ✅
