// Generate a secure random JWT secret
const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('hex');
console.log('\n🔐 Generated JWT Secret:');
console.log('='.repeat(60));
console.log(secret);
console.log('='.repeat(60));
console.log('\n📝 Copy this and use it as JWT_SECRET in your Render environment variables\n');

