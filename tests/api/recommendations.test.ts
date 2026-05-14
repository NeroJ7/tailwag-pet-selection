import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import handler from '@/pages/api/recommendations';

// Mock 模块
jest.mock('@/lib/db', () => ({
  query: jest.fn(),
}));

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/pages/api/auth/[...nextauth]', () => ({
  authOptions: {},
}));

describe('GET /api/recommendations', () => {
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

  it('returns 405 for non-GET requests', async () => {
    mockReq = {
      method: 'POST',
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(405);
  });

  it('returns 401 if not logged in', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    mockReq = {
      method: 'GET',
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(401);
  });

  it('returns popular products if user has no pets', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    (query as jest.Mock)
      .mockResolvedValueOnce({ rows: [{ id: 'user-123' }] }) // 用户查询
      .mockResolvedValueOnce({ rows: [] }) // 宠物查询（空）
      .mockResolvedValueOnce({ rows: [{ id: 'prod-1', name: 'Popular Product' }] }); // 热门产品

    mockReq = {
      method: 'GET',
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        based_on: 'popular',
      })
    );
  });

  it('returns recommendations based on pet profile', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    const mockPet = {
      id: 'pet-123',
      name: 'Buddy',
      species: '狗',
      birthday: '2020-01-01',
      weight: 30,
      is_neutered: true,
    };

    const mockProduct = {
      id: 'prod-1',
      name: '大型犬骨科床',
      description: '适合大型犬的骨科记忆棉床',
      tag: '骨科',
      specs: {},
    };

    (query as jest.Mock)
      .mockResolvedValueOnce({ rows: [{ id: 'user-123' }] }) // 用户查询
      .mockResolvedValueOnce({ rows: [mockPet] }) // 宠物查询
      .mockResolvedValueOnce({ rows: [mockProduct] }) // 产品查询
      .mockResolvedValueOnce({ rows: [] }); // 健康记录查询（空）

    mockReq = {
      method: 'GET',
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        based_on: 'pet_profile',
        recommendations: expect.any(Array),
      })
    );
  });

  it('handles database errors gracefully', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    (query as jest.Mock).mockRejectedValue(new Error('DB Error'));

    mockReq = {
      method: 'GET',
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
