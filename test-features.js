// Feature Testing Script
// Run with: node test-features.js

const BASE_URL = 'http://localhost:3000';

async function testFeature(name, testFn) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    await testFn();
    console.log(`✅ PASS: ${name}`);
    return true;
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.error(`   Error: ${error.message}`);
    return false;
  }
}

async function login(email, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.data.token;
}

async function main() {
  console.log('🚀 Starting Feature Tests...\n');
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;

  // Test 1: Admin Login
  let adminToken;
  if (await testFeature('Admin Login', async () => {
    adminToken = await login('admin@demo.com', 'demo123');
    if (!adminToken) throw new Error('No token returned');
  })) passed++; else failed++;

  // Test 2: Student Login
  let studentToken;
  if (await testFeature('Student Login', async () => {
    studentToken = await login('student@demo.com', 'demo123');
    if (!studentToken) throw new Error('No token returned');
  })) passed++; else failed++;

  // Test 3: Invalid Login
  if (await testFeature('Invalid Login Rejected', async () => {
    try {
      await login('invalid@test.com', 'wrongpass');
      throw new Error('Should have failed');
    } catch (error) {
      if (!error.message.includes('Invalid credentials')) throw error;
    }
  })) passed++; else failed++;

  // Test 4: Admin Stats
  if (await testFeature('Admin Stats API', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    if (data.data.totalTeachers !== undefined) {
      throw new Error('totalTeachers should not exist');
    }
    if (typeof data.data.totalStudents !== 'number') {
      throw new Error('Missing totalStudents');
    }
  })) passed++; else failed++;

  // Test 5: Admin Users List
  if (await testFeature('Admin Users List', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    if (!Array.isArray(data.data)) throw new Error('Users should be array');
    // Check no teacher role exists
    const hasTeacher = data.data.some(u => u.role === 'TEACHER');
    if (hasTeacher) throw new Error('TEACHER role should not exist');
  })) passed++; else failed++;

  // Test 6: Admin Reports
  if (await testFeature('Admin Reports API', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/reports`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    if (data.data.totalTeachers !== undefined) {
      throw new Error('totalTeachers should not exist');
    }
  })) passed++; else failed++;

  // Test 7: Student Profile
  if (await testFeature('Student Profile API', async () => {
    const response = await fetch(`${BASE_URL}/api/student/profile`, {
      headers: { 'Authorization': `Bearer ${studentToken}` },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    if (data.data.teacher !== undefined) {
      throw new Error('teacher field should not exist');
    }
    if (!data.data.name) throw new Error('Missing name');
    if (!data.data.gradeLevel) throw new Error('Missing gradeLevel');
  })) passed++; else failed++;

  // Test 8: Student Stats
  if (await testFeature('Student Stats API', async () => {
    const response = await fetch(`${BASE_URL}/api/student/stats`, {
      headers: { 'Authorization': `Bearer ${studentToken}` },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  })) passed++; else failed++;

  // Test 9: Chat Sessions
  if (await testFeature('Chat Sessions API', async () => {
    const response = await fetch(`${BASE_URL}/api/chat/sessions`, {
      headers: { 'Authorization': `Bearer ${studentToken}` },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    if (!Array.isArray(data.data)) throw new Error('Sessions should be array');
  })) passed++; else failed++;

  // Test 10: Settings Load
  if (await testFeature('Settings Load from Database', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/settings`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    if (typeof data.data.systemName !== 'string') {
      throw new Error('Missing systemName');
    }
    if (typeof data.data.maintenanceMode !== 'boolean') {
      throw new Error('Missing maintenanceMode');
    }
  })) passed++; else failed++;

  // Test 11: Settings Save
  if (await testFeature('Settings Save to Database', async () => {
    const testValue = `Test-${Date.now()}`;
    const saveResponse = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemName: testValue,
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        autoBackup: true,
        maxSessionsPerDay: 10,
        sessionTimeout: 30,
      }),
    });
    const saveData = await saveResponse.json();
    if (!saveData.success) throw new Error(saveData.error);
    
    // Verify it was saved
    const loadResponse = await fetch(`${BASE_URL}/api/admin/settings`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const loadData = await loadResponse.json();
    if (loadData.data.systemName !== testValue) {
      throw new Error('Settings not persisted');
    }
  })) passed++; else failed++;

  // Test 12: Unauthorized Access
  if (await testFeature('Unauthorized Access Blocked', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/stats`);
    if (response.status !== 401) {
      throw new Error('Should return 401 for no token');
    }
  })) passed++; else failed++;

  // Test 13: Student Cannot Access Admin
  if (await testFeature('Student Cannot Access Admin APIs', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${studentToken}` },
    });
    if (response.status !== 403) {
      throw new Error('Should return 403 for student accessing admin');
    }
  })) passed++; else failed++;

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! System is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }
  
  console.log('\n' + '='.repeat(50));
}

main().catch(error => {
  console.error('\n❌ Test suite error:', error);
  process.exit(1);
});
