import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import DOMPurify from 'isomorphic-dompurify';

// Mock 模块
jest.mock('@/lib/db', () => ({
  query: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

jest.mock('isomorphic-dompurify', () => ({
  sanitize: jest.fn((input) => input),
}));

// 导入handler（必须在mock之后）
import handler from '@/pages/api/auth/register';

describe('POST /api/auth/register', () => {
  let mockReq: any;
  let mockRes: any;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('returns 405 for non-POST requests', async () => {
    mockReq = {
      method: 'GET',
      body: {},
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(405);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('returns 400 if email is missing', async () => {
    mockReq = {
      method: 'POST',
      body: { password: 'Test123!' },
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: '邮箱和密码为必填项' });
  });

  it('returns 400 if password is missing', async () => {
    mockReq = {
      method: 'POST',
      body: { email: 'test@example.com' },
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: '邮箱和密码为必填项' });
  });

  it('returns 400 for invalid email format', async () => {
    mockReq = {
      method: 'POST',
      body: { email: 'invalid-email', password: 'Test123!' },
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: '邮箱格式不正确' });
  });

  it('returns 400 for weak password', async () => {
    mockReq = {
      method: 'POST',
      body: { email: 'test@example.com', password: 'weak' },
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: '密码必须包含大小写字母、数字和特殊字符，至少8位',
    });
  });

  it('returns 400 if email already exists', async () => {
    mockReq = {
      method: 'POST',
      body: { email: 'existing@example.com', password: 'Test123!' },
    };

    (query as jest.Mock).mockResolvedValue({ rows: [{ id: '123' }] });

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: '该邮箱已被注册' });
  });

  it('creates user successfully', async () => {
    mockReq = {
      method: 'POST',
      body: { email: 'new@example.com', password: 'Test123!', name: 'Test User' },
    };

    (query as jest.Mock)
      .mockResolvedValueOnce({ rows: [] }) // 检查用户是否存在
      .mockResolvedValueOnce({}); // 插入用户

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        user: expect.objectContaining({
          email: 'new@example.com',
          name: 'Test User',
        }),
      })
    );
  });

  it('calls DOMPurify.sanitize on email and name', async () => {
    mockReq = {
      method: 'POST',
      body: { email: '  TEST@EXAMPLE.COM  ', password: 'Test123!', name: '  Test User  ' },
    };

    (query as jest.Mock)
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({});

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

    await handler(mockReq, mockRes);

    expect(DOMPurify.sanitize).toHaveBeenCalledWith('  TEST@EXAMPLE.COM  '.trim().toLowerCase());
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('  Test User  '.trim());
  });
});
