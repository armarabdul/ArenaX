const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000';

// Admin accounts to create
const admins = [
  { email: 'admin1@arenax.com', password: 'Admin123!', name: 'Admin One' },
  { email: 'admin2@arenax.com', password: 'Admin123!', name: 'Admin Two' },
  { email: 'admin3@arenax.com', password: 'Admin123!', name: 'Admin Three' },
  { email: 'admin4@arenax.com', password: 'Admin123!', name: 'Admin Four' },
  { email: 'admin5@arenax.com', password: 'Admin123!', name: 'Admin Five' },
  { email: 'admin6@arenax.com', password: 'Admin123!', name: 'Admin Six' },
  { email: 'admin7@arenax.com', password: 'Admin123!', name: 'Admin Seven' },
  { email: 'admin8@arenax.com', password: 'Admin123!', name: 'Admin Eight' },
  { email: 'admin9@arenax.com', password: 'Admin123!', name: 'Admin Nine' },
  { email: 'admin10@arenax.com', password: 'Admin123!', name: 'Admin Ten' },
];

async function createAdmin(adminData) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, adminData);
    return { success: true, data: response.data, email: adminData.email };
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      return { success: false, error: 'Already exists', email: adminData.email };
    }
    return { success: false, error: error.response?.data?.message || error.message, email: adminData.email };
  }
}

async function createAllAdmins() {
  console.log('🚀 Starting admin account creation...\n');
  console.log(`📡 API URL: ${API_URL}\n`);
  console.log('⏳ Creating 10 admin accounts...\n');

  const results = [];
  
  for (let i = 0; i < admins.length; i++) {
    const admin = admins[i];
    console.log(`[${i + 1}/10] Creating admin: ${admin.email}...`);
    
    const result = await createAdmin(admin);
    results.push(result);
    
    if (result.success) {
      console.log(`   ✅ Successfully created: ${admin.email}`);
    } else {
      console.log(`   ❌ Failed: ${admin.email} - ${result.error}`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successfully created: ${successful.length}/10`);
  console.log(`❌ Failed: ${failed.length}/10\n`);

  if (successful.length > 0) {
    console.log('✅ Created Admins:');
    successful.forEach(r => {
      console.log(`   - ${r.email}`);
    });
    console.log('');
  }

  if (failed.length > 0) {
    console.log('❌ Failed Admins:');
    failed.forEach(r => {
      console.log(`   - ${r.email}: ${r.error}`);
    });
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('\n📝 Login Credentials:');
  console.log('   Email format: admin1@arenax.com through admin10@arenax.com');
  console.log('   Password: Admin123!');
  console.log('\n⚠️  IMPORTANT: Change passwords after first login!');
  console.log('⚠️  IMPORTANT: Make sure the backend server is running before running this script!\n');
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${API_URL}/api/leaderboard`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  console.log('🔍 Checking if backend server is running...\n');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ ERROR: Backend server is not running!');
    console.log(`   Please start the server first: cd backend && npm run dev\n`);
    console.log(`   Or check if the API URL is correct: ${API_URL}\n`);
    process.exit(1);
  }

  console.log('✅ Backend server is running!\n');
  await createAllAdmins();
})();

