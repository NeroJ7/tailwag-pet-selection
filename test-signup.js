// 测试注册功能
const http = require('http');
const https = require('https');

// 先获取 CSRF token
function getCsrfToken(callback) {
  http.get('http://localhost:3000/api/auth/csrf', (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      const data = JSON.parse(body);
      callback(data.csrfToken);
    });
  });
}

// 注册新用户
function signup(csrfToken) {
  const data = JSON.stringify({
    email: 'test' + Date.now() + '@example.com',
    name: '测试用户',
    password: '123456',
    confirmPassword: '123456',
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('状态码:', res.statusCode);
      console.log('响应:', body.substring(0, 200));
    });
  });

  req.on('error', (e) => {
    console.error('请求失败:', e.message);
  });

  req.write(data);
  req.end();
}

// 主流程
getCsrfToken((csrfToken) => {
  console.log('CSRF Token:', csrfToken);
  signup(csrfToken);
});
