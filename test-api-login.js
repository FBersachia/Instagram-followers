const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔐 Testing login API endpoint...');
    console.log('━'.repeat(60));
    console.log('POST http://localhost:3000/api/auth/login');
    console.log('Body: { username: "emab", password: "F5l$2o25" }');
    console.log('━'.repeat(60));

    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'emab',
      password: 'F5l$2o25'
    });

    console.log('\n✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('\n❌ Login failed!');
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n❌ Cannot connect to API server!');
      console.log('Make sure the API server is running on http://localhost:3000');
      console.log('Run: npm run dev:api');
    } else {
      console.log('\n❌ Error:', error.message);
    }
  }
}

testLogin();
