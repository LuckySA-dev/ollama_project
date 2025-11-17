# 🧪 Manual Testing Guide

## 🎯 Quick Start

**Server**: http://localhost:3000

**Demo Accounts**:
```
Admin:   admin@demo.com    (password: demo123)
Student: student@demo.com  (password: demo123)
```

---

## ✅ Test Checklist

### **1. Authentication Tests** 🔐

#### **Test 1.1: Admin Login**
1. Go to http://localhost:3000/login
2. Enter: `admin@demo.com` / `demo123`
3. Click "เข้าสู่ระบบ"

**Expected**:
- ✅ Redirects to `/admin/dashboard`
- ✅ Shows admin dashboard with stats
- ✅ No errors in console

**Status**: [ ]

---

#### **Test 1.2: Student Login**
1. Logout (if logged in)
2. Go to http://localhost:3000/login
3. Enter: `student@demo.com` / `demo123`
4. Click "เข้าสู่ระบบ"

**Expected**:
- ✅ Redirects to `/student/dashboard`
- ✅ Shows student dashboard
- ✅ No errors in console

**Status**: [ ]

---

#### **Test 1.3: Invalid Login**
1. Go to http://localhost:3000/login
2. Enter: `wrong@email.com` / `wrongpass`
3. Click "เข้าสู่ระบบ"

**Expected**:
- ✅ Shows error message
- ✅ Does not redirect
- ✅ Stays on login page

**Status**: [ ]

---

#### **Test 1.4: Register New Student**
1. Go to http://localhost:3000/register
2. Fill in:
   - Name: `Test Student`
   - Email: `test@student.com`
   - Password: `test123`
   - Grade: `ม.๑ (7th Grade)`
3. Click "สร้างบัญชี"

**Expected**:
- ✅ Account created
- ✅ Redirects to `/student/dashboard`
- ✅ Only STUDENT role created (check in admin panel)

**Status**: [ ]

---

### **2. Student Features Tests** 👨‍🎓

#### **Test 2.1: Student Dashboard**
1. Login as student
2. Check dashboard at `/student/dashboard`

**Expected**:
- ✅ Page loads without errors
- ✅ Shows student stats
- ✅ Shows recent activity
- ✅ No teacher-related data

**Status**: [ ]

---

#### **Test 2.2: Student Navigation**
1. Login as student
2. Check navigation bar

**Expected**:
- ✅ Shows "แดชบอร์ด" (Dashboard)
- ✅ Shows "สนทนา" (Chat)
- ✅ Does NOT show "รายงาน" (Reports)
- ✅ Does NOT show "ความก้าวหน้า" (Progress)
- ✅ Theme toggle works
- ✅ Logout button works

**Status**: [ ]

---

#### **Test 2.3: Chat Interface**
1. Login as student
2. Go to `/student/chat`
3. Send a message: "สวัสดีครับ ผมต้องการความช่วยเหลือ"

**Expected**:
- ✅ Chat interface loads
- ✅ Can type message
- ✅ Send button works
- ✅ AI responds (if Ollama is running)
- ✅ Messages display correctly
- ✅ Behavior tags show (if any)
- ✅ No `behaviorTags.map` error

**Status**: [ ]

---

#### **Test 2.4: Chat History**
1. Login as student
2. Go to `/student/chat`
3. Check session list on left

**Expected**:
- ✅ Shows previous chat sessions
- ✅ Can click to load session
- ✅ Messages load correctly
- ✅ Timestamps display
- ✅ No errors

**Status**: [ ]

---

### **3. Admin Features Tests** 👨‍💼

#### **Test 3.1: Admin Dashboard**
1. Login as admin
2. Check dashboard at `/admin/dashboard`

**Expected**:
- ✅ Page loads without errors
- ✅ Shows system stats cards
- ✅ Shows "นักเรียนทั้งหมด" (Total Students)
- ✅ Shows "เซสชันทั้งหมด" (Total Sessions)
- ✅ Does NOT show "ครูทั้งหมด" (Total Teachers)
- ✅ Stats are numbers, not errors

**Status**: [ ]

---

#### **Test 3.2: Admin Navigation**
1. Login as admin
2. Check navigation bar

**Expected**:
- ✅ Shows "แดชบอร์ด" (Dashboard)
- ✅ Shows "ผู้ใช้งาน" (Users)
- ✅ Shows "รายงาน" (Reports)
- ✅ Shows "ตั้งค่า" (Settings)
- ✅ All links work
- ✅ Theme toggle works
- ✅ Logout works

**Status**: [ ]

---

#### **Test 3.3: Users Management**
1. Login as admin
2. Go to `/admin/users`

**Expected**:
- ✅ User list loads
- ✅ Shows students and admins
- ✅ Does NOT show teachers
- ✅ Search box works
- ✅ Filter by role works
- ✅ Each user shows:
  - Name
  - Email
  - Role badge (STUDENT or ADMIN)
  - Grade level (for students)
  - Created date

**Status**: [ ]

---

#### **Test 3.4: Delete User**
1. Login as admin
2. Go to `/admin/users`
3. Find test user (not demo accounts)
4. Click delete button (trash icon)

**Expected**:
- ✅ Confirmation dialog appears
- ✅ Shows warning message
- ✅ If confirmed: user deleted
- ✅ List refreshes automatically
- ✅ Success message shows
- ✅ Cannot delete own account

**Status**: [ ]

---

#### **Test 3.5: Reports Page**
1. Login as admin
2. Go to `/admin/reports`

**Expected**:
- ✅ Page loads without errors
- ✅ Shows system statistics
- ✅ Shows "นักเรียนทั้งหมด" (Total Students)
- ✅ Does NOT show "ครูทั้งหมด" (Total Teachers)
- ✅ Shows top students list
- ✅ Export buttons visible

**Status**: [ ]

---

#### **Test 3.6: Export Users CSV**
1. Login as admin
2. Go to `/admin/reports`
3. Click "รายงานผู้ใช้ (CSV)"

**Expected**:
- ✅ CSV file downloads
- ✅ Filename: `users-export-YYYY-MM-DD.csv`
- ✅ Contains user data
- ✅ Columns: ID, Name, Email, Role, Grade Level, Created At
- ✅ No teacher data

**Status**: [ ]

---

#### **Test 3.7: Export Sessions CSV**
1. Login as admin
2. Go to `/admin/reports`
3. Click "รายงานการสนทนา (CSV)"

**Expected**:
- ✅ CSV file downloads
- ✅ Filename: `sessions-export-YYYY-MM-DD.csv`
- ✅ Contains session data
- ✅ Columns: Session ID, Student Name, Student Email, Started At, Ended At, Message Count, Summary

**Status**: [ ]

---

#### **Test 3.8: Settings Page Load**
1. Login as admin
2. Go to `/admin/settings`

**Expected**:
- ✅ Page loads without errors
- ✅ Shows all settings sections:
  - ตั้งค่าทั่วไป (General)
  - การแจ้งเตือน (Notifications)
  - ความปลอดภัย (Security)
  - การบำรุงรักษา (Maintenance)
- ✅ Current values loaded from database
- ✅ Switches work
- ✅ Input fields work

**Status**: [ ]

---

#### **Test 3.9: Settings Save & Persist**
1. Login as admin
2. Go to `/admin/settings`
3. Change "ชื่อระบบ" to "Test System"
4. Toggle "โหมดบำรุงรักษา" ON
5. Click "บันทึกการตั้งค่า"
6. Wait for success message
7. Refresh page (F5)

**Expected**:
- ✅ Success message appears after save
- ✅ After refresh: "ชื่อระบบ" still shows "Test System"
- ✅ After refresh: "โหมดบำรุงรักษา" still ON
- ✅ Settings persisted in database

**Status**: [ ]

---

### **4. Security Tests** 🔒

#### **Test 4.1: Unauthorized Access**
1. Logout (clear cookies/localStorage)
2. Try to access: http://localhost:3000/admin/dashboard

**Expected**:
- ✅ Redirects to `/login`
- ✅ Cannot access admin pages

**Status**: [ ]

---

#### **Test 4.2: Student Cannot Access Admin**
1. Login as student
2. Try to access: http://localhost:3000/admin/dashboard

**Expected**:
- ✅ Shows error or redirects
- ✅ Cannot access admin features

**Status**: [ ]

---

#### **Test 4.3: Admin Cannot Access Student Chat**
1. Login as admin
2. Try to access: http://localhost:3000/student/chat

**Expected**:
- ✅ Shows error or redirects
- ✅ Admin doesn't have student features

**Status**: [ ]

---

### **5. API Tests** 🔌

#### **Test 5.1: Check API Responses**

Open browser console (F12) and run:

```javascript
// Test Admin Stats
fetch('/api/admin/stats', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('auth-token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('Admin Stats:', data);
  if (data.data.totalTeachers !== undefined) {
    console.error('❌ BUG: totalTeachers should not exist!');
  } else {
    console.log('✅ No totalTeachers field');
  }
});

// Test Student Profile
fetch('/api/student/profile', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('auth-token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('Student Profile:', data);
  if (data.data.teacher !== undefined) {
    console.error('❌ BUG: teacher field should not exist!');
  } else {
    console.log('✅ No teacher field');
  }
});
```

**Expected**:
- ✅ No `totalTeachers` in admin stats
- ✅ No `teacher` in student profile
- ✅ All responses have `success: true`

**Status**: [ ]

---

### **6. Database Tests** 💾

#### **Test 6.1: Check Database Schema**

Run in terminal:
```bash
npx prisma studio
```

Then check:
- ✅ No `teachers` table exists
- ✅ `system_settings` table exists
- ✅ `Role` enum only has STUDENT, ADMIN
- ✅ `students` table has no `teacherId` column

**Status**: [ ]

---

### **7. UI/UX Tests** 🎨

#### **Test 7.1: Theme Toggle**
1. Login (any account)
2. Click theme toggle button

**Expected**:
- ✅ Switches between light/dark mode
- ✅ Persists after refresh
- ✅ Works on all pages

**Status**: [ ]

---

#### **Test 7.2: Responsive Design**
1. Resize browser window
2. Test on mobile view (F12 → Device toolbar)

**Expected**:
- ✅ Navigation collapses on mobile
- ✅ Tables/cards stack properly
- ✅ No horizontal scroll
- ✅ Buttons remain accessible

**Status**: [ ]

---

#### **Test 7.3: Error Messages**
1. Try various error scenarios
2. Check error messages display

**Expected**:
- ✅ Error messages in Thai
- ✅ Clear and helpful
- ✅ Properly styled
- ✅ Dismissible

**Status**: [ ]

---

## 🐛 Known Issues to Check

### **Issue 1: behaviorTags Error**
**Where**: Student chat messages
**Check**: Open chat, send message, check console
**Expected**: No `behaviorTags.map is not a function` error
**Status**: [ ] Fixed / [ ] Still exists

---

### **Issue 2: Teacher References**
**Where**: All API responses
**Check**: Use browser console to check API responses
**Expected**: No `teacher` or `totalTeachers` fields
**Status**: [ ] Fixed / [ ] Still exists

---

### **Issue 3: Settings Persistence**
**Where**: Admin settings page
**Check**: Save settings, restart server, check if persisted
**Expected**: Settings survive server restart
**Status**: [ ] Fixed / [ ] Still exists

---

## 📊 Test Summary

**Total Tests**: 30+

**Completed**: _____ / 30+

**Passed**: _____ 

**Failed**: _____

**Critical Bugs Found**: _____

---

## 🚨 Bug Report Template

If you find a bug, document it here:

### **Bug #1**
- **Title**: 
- **Severity**: Critical / High / Medium / Low
- **Location**: 
- **Steps to Reproduce**:
  1. 
  2. 
  3. 
- **Expected**: 
- **Actual**: 
- **Screenshot**: 
- **Console Errors**: 

---

## ✅ Sign Off

**Tested By**: _______________

**Date**: _______________

**Overall Status**: [ ] All Pass / [ ] Some Failures / [ ] Major Issues

**Notes**:


---

**Happy Testing!** 🎉
