// E2E 测试脚本 - TailWag 宠物用品优选
// 测试核心用户流程：注册、登录、宠物管理

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3000';
let authToken = null;
let testUserId = null;
let testPetId = null;

// 辅助函数：发送 HTTP 请求
function request(method, path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      data = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// 测试用例
async function runTests() {
  console.log('=== TailWag E2E 测试开始 ===\n');

  // 测试 1: 注册 - 密码过短
  console.log('测试 1: 注册 - 密码过短');
  let res = await request('POST', '/api/auth/register', {
    email: 'test1@example.com',
    password: '123',
    name: '测试用户'
  });
  console.log(`  状态: ${res.status}, 响应: ${JSON.stringify(res.data)}`);
  console.assert(res.status === 400, '应返回 400');
  console.assert(res.data.error === '密码长度至少6位', '错误消息不正确');

  // 测试 2: 注册 - 缺少邮箱
  console.log('测试 2: 注册 - 缺少邮箱');
  res = await request('POST', '/api/auth/register', {
    password: '123456',
    name: '测试用户'
  });
  console.log(`  状态: ${res.status}, 响应: ${JSON.stringify(res.data)}`);
  console.assert(res.status === 400, '应返回 400');
  console.assert(res.data.error === '邮箱和密码为必填项', '错误消息不正确');

  // 测试 3: 注册 - 成功
  console.log('测试 3: 注册 - 成功');
  const testEmail = `test${Date.now()}@example.com`;
  res = await request('POST', '/api/auth/register', {
    email: testEmail,
    password: '123456',
    name: '测试用户'
  });
  console.log(`  状态: ${res.status}, 响应: ${JSON.stringify(res.data)}`);
  console.assert(res.status === 201, '应返回 201');
  console.assert(res.data.success === true, '应返回 success: true');
  console.assert(res.data.user.email === testEmail, '邮箱不正确');
  testUserId = res.data.user.id;

  // 测试 4: 注册 - 邮箱重复
  console.log('测试 4: 注册 - 邮箱重复');
  res = await request('POST', '/api/auth/register', {
    email: testEmail,
    password: '123456',
    name: '测试用户2'
  });
  console.log(`  状态: ${res.status}, 响应: ${JSON.stringify(res.data)}`);
  console.assert(res.status === 400, '应返回 400');
  console.assert(res.data.error === '该邮箱已被注册', '错误消息不正确');

  // 测试 5: 登录 - 错误密码
  console.log('测试 5: 登录 - 错误密码');
  res = await request('POST', '/api/auth/callback/credentials', {
    email: testEmail,
    password: 'wrongpassword',
    csrfToken: 'test'
  });
  console.log(`  状态: ${res.status}`);
  // NextAuth 会重定向，所以可能是 302 或 200

  // 测试 6: 未登录访问受保护 API
  console.log('测试 6: 未登录访问宠物列表');
  res = await request('GET', '/api/pets', null);
  console.log(`  状态: ${res.status}, 响应: ${JSON.stringify(res.data)}`);
  console.assert(res.status === 401, '应返回 401');
  console.assert(res.data.error === '未登录', '错误消息不正确');

  // 测试 7: 添加宠物 - 缺少必填字段
  console.log('测试 7: 添加宠物 - 缺少必填字段');
  res = await request('POST', '/api/pets', {
    name: '小白'
    // 缺少 species
  });
  console.log(`  状态: ${res.status}, 响应: ${JSON.stringify(res.data)}`);
  console.assert(res.status === 400, '应返回 400');
  console.assert(res.data.error.includes('species'), '应提示 species 为必填项');

  // 测试 8: 添加宠物 - 成功（需要先获取 session）
  console.log('测试 8: 添加宠物 - 成功');
  console.log('  ⚠️  需要有效的 session cookie，跳过（需要浏览器环境）');
  // 在实际 E2E 测试中，这里需要先用 NextAuth 登录获取 session

  // 测试 9: DELETE 方法不支持
  console.log('测试 9: 不支持的 HTTP 方法');
  res = await request('PUT', '/api/pets', {
    name: '测试',
    species: '狗'
  });
  console.log(`  状态: ${res.status}, 响应: ${JSON.stringify(res.data)}`);
  console.assert(res.status === 405, '应返回 405');

  // 测试 10: 注册 - 不支持 GET 方法
  console.log('测试 10: 注册 - 不支持 GET 方法');
  res = await request('GET', '/api/auth/register', null);
  console.log(`  状态: ${res.status}, 响应: ${JSON.stringify(res.data)}`);
  console.assert(res.status === 405, '应返回 405');

  console.log('\n=== 测试完成 ===');
  console.log('\n发现的问题:');
  console.log('1. register.ts: 使用 require() 而不是 import');
  console.log('2. register.ts: 密码强度验证不足（仅长度>=6）');
  console.log('3. register.ts: 缺少 CSRF 保护');
  console.log('4. [...nextauth].ts: authorize 返回 null，无法区分"用户不存在"和"密码错误"');
  console.log('5. pets.ts: 使用 require() 而不是 import');
  console.log('6. pets.ts: 错误信息可能泄露敏感数据（details: err.message）');
  console.log('7. 所有 API: 缺少速率限制');
  console.log('8. 所有 API: 缺少输入 sanitization');
}

runTests().catch(console.error);
