// 使用 Node.js 测试 API（避免 Windows 命令行编码问题）
const http = require('http');

const data = JSON.stringify({
  name: "测试狗狗",
  species: "狗",
  breed: "金毛",
  gender: "公"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/pets',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.setEncoding('utf-8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('状态码:', res.statusCode);
    console.log('响应:', body);
    try {
      const json = JSON.parse(body);
      console.log('解析后的 name:', json.name);
    } catch (e) {
      console.error('解析 JSON 失败:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('请求失败:', e.message);
});

req.write(data);
req.end();
