// 测试 /api/pets API
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/pets',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ API 响应状态:', res.statusCode);
    console.log('📊 响应数据:', data);
  });
});

req.on('error', (err) => {
  console.error('❌ API 请求失败:', err.message);
  console.log('提示: 请确保 Next.js 服务器已启动 (npm run dev)');
});

req.end();
