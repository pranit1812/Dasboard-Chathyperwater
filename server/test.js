// Simple test script to check if the server API is working
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/feedback',
  method: 'GET',
};

console.log('Testing feedback API...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      console.log('API response received:');
      console.log(`Number of feedback entries: ${parsedData.length}`);
      console.log('Test completed successfully!');
    } catch (e) {
      console.error('Error parsing response:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Error connecting to API:', error.message);
  console.log('Make sure the server is running on port 3001');
});

req.end(); 