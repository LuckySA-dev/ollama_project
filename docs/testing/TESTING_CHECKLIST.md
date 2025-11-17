# Testing Checklist - AI Study Assistant

## Test Accounts Created

### Student Account
- **Email**: `alex@student.com`
- **Password**: `password123`
- **Grade**: 7
- **Has sample data**: Yes (chat sessions, behaviors, scores)

### Teacher Account
- **Email**: `teacher@school.com`
- **Password**: `password123`

### Additional Students (no sample data)
- `maria@student.com` / `password123` (Grade 8)
- `jordan@student.com` / `password123` (Grade 9)

---

## Testing Workflow

### ✅ Phase 1: Landing Page & Authentication
- [ ] 1.1 Visit http://localhost:3000
- [ ] 1.2 Check landing page loads correctly
- [ ] 1.3 Click "Get Started" → Register page
- [ ] 1.4 Click "Sign In" → Login page
- [ ] 1.5 Test registration with new account
- [ ] 1.6 Test login with `alex@student.com` / `password123`
- [ ] 1.7 Verify redirect to student dashboard

**Expected Issues**: None (basic Next.js routing)

---

### ✅ Phase 2: Student Dashboard
- [ ] 2.1 Dashboard loads at `/student/dashboard`
- [ ] 2.2 Stats cards display correctly:
  - Total Sessions
  - Focus Score
  - Motivation
  - Study Streak
- [ ] 2.3 Behavior chart renders (Recharts)
- [ ] 2.4 Navigation menu works (Dashboard, Chat, Reports)

**Potential Issues**:
- Chart may not render if no data
- Stats may show "N/A" for new users

---

### ✅ Phase 3: AI Chat Interface
- [ ] 3.1 Navigate to `/student/chat`
- [ ] 3.2 Chat interface loads
- [ ] 3.3 **CRITICAL TEST**: Send a message
  - Type: "I'm having trouble focusing on math homework"
  - Click Send
  - **Check**: Does AI respond?
  - **Check**: Does message appear in chat?
  - **Check**: Are behavior tags extracted?

**Expected Issues**:
- ❌ **Ollama connection** - Check if Ollama is running
- ❌ **Safety filter** - May block certain words
- ❌ **Token/Auth** - Check localStorage for auth-token

---

### ✅ Phase 4: Report Generation
- [ ] 4.1 Navigate to `/student/reports`
- [ ] 4.2 Click "Generate Weekly Report"
- [ ] 4.3 **Check**: Report generates successfully
- [ ] 4.4 **Check**: Report card displays
- [ ] 4.5 Click report to view details (if implemented)
- [ ] 4.6 Try "Generate Monthly Report"

**Expected Issues**:
- ❌ **Ollama required** - Report generation uses AI
- ❌ **Insufficient data** - May need chat history first

---

### ✅ Phase 5: API Endpoints Test

#### Authentication APIs
- [ ] 5.1 POST `/api/auth/register` - Create new user
- [ ] 5.2 POST `/api/auth/login` - Login existing user
- [ ] 5.3 Check JWT token in response

#### Student APIs
- [ ] 5.4 GET `/api/student/profile` - Fetch profile
- [ ] 5.5 GET `/api/student/stats` - Fetch dashboard stats

#### Chat API
- [ ] 5.6 POST `/api/chat/message` - Send message
  - **Check**: Message saved to DB
  - **Check**: AI response generated
  - **Check**: Behavior logged

#### Report APIs
- [ ] 5.7 POST `/api/report/generate` - Generate report
- [ ] 5.8 GET `/api/report/history` - Fetch reports

---

## Known Issues to Check

### 🔴 Critical (App Breaking)

1. **Ollama Not Running**
   - Symptom: Chat fails, reports fail
   - Fix: Run `ollama serve` in terminal
   - Test: `curl http://localhost:11434/api/tags`

2. **Database Connection**
   - Symptom: All API calls fail
   - Fix: Check PostgreSQL is running
   - Test: `docker ps` (should show postgres-study)

3. **Missing Auth Token**
   - Symptom: 401 Unauthorized errors
   - Fix: Re-login to get new token
   - Check: Browser DevTools → Application → Local Storage

### 🟡 Medium (Feature Breaking)

4. **CORS Issues**
   - Symptom: API calls blocked in browser
   - Check: Browser console for CORS errors

5. **JSON Parsing Errors**
   - Symptom: AI response fails to parse
   - Location: `lib/report/generator.ts` line 97
   - Fix: AI may not return valid JSON

6. **Behavior Extraction Fails**
   - Symptom: No behavior tags on messages
   - Location: `lib/llm/promptTemplate.ts`
   - Check: AI response format

### 🟢 Minor (UI/UX)

7. **Chart Not Rendering**
   - Symptom: Empty chart on dashboard
   - Cause: No weekly score data
   - Fix: Generate more chat sessions

8. **Empty States**
   - New users have no data
   - Should show helpful messages

---

## Testing Commands

### Check Ollama Status
```bash
ollama list
curl http://localhost:11434/api/tags
```

### Check Database
```bash
docker exec -it postgres-study psql -U postgres -d study_assistant -c "SELECT COUNT(*) FROM users;"
```

### Check Logs
```bash
# In the terminal running npm run dev
# Watch for errors in real-time
```

### Test API Directly
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@student.com","password":"password123"}'

# Get Stats (replace TOKEN)
curl http://localhost:3000/api/student/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Test Results Template

### Issue Report Format
```
Issue #: 
Severity: Critical / Medium / Minor
Feature: Authentication / Chat / Dashboard / Reports
Description: 
Steps to Reproduce:
1. 
2. 
3. 
Expected: 
Actual: 
Error Message: 
```

---

## Next Steps After Testing

1. **Document all issues found**
2. **Prioritize fixes**: Critical → Medium → Minor
3. **Test each fix**
4. **Re-test entire flow**

---

## Quick Start Testing

**Fastest way to test everything:**

1. Open http://localhost:3000
2. Login: `alex@student.com` / `password123`
3. Go to Chat → Send: "I need help with homework"
4. Check if AI responds ← **MOST CRITICAL TEST**
5. Go to Reports → Generate Weekly Report
6. Check if report generates ← **SECOND CRITICAL TEST**

If both work, core functionality is solid! 🎉
