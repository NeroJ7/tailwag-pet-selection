import { query } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import handler from '@/pages/api/pets';

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

describe('POST /api/pets', () => {
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

    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    (query as jest.Mock).mockImplementation((sql, params) => {
      if (sql.includes('SELECT id FROM "users"')) {
        return Promise.resolve({ rows: [{ id: 'user-123' }] });
      }
      if (sql.includes('INSERT INTO "pets"')) {
        return Promise.resolve({ rows: [{ id: 'pet-123' }] });
      }
      return Promise.resolve({ rows: [] });
    });
  });

  it('returns 401 if not logged in', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    mockReq = {
      method: 'POST',
      query: {},
      body: { name: 'Test Pet', species: 'Dog' },
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(401);
  });

  it('returns 400 if name is missing', async () => {
    mockReq = {
      method: 'POST',
      query: {},
      body: { species: 'Dog' },
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'name 和 species 为必填项' });
  });

  it('returns 400 if species is missing', async () => {
    mockReq = {
      method: 'POST',
      query: {},
      body: { name: 'Test Pet' },
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'name 和 species 为必填项' });
  });

  it('creates pet successfully', async () => {
    mockReq = {
      method: 'POST',
      query: {},
      body: {
        name: 'Test Pet',
        species: 'Dog',
        breed: 'Labrador',
        gender: 'male',
      },
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ id: 'pet-123' }));
  });

  it('handles GET request to list pets', async () => {
    (query as jest.Mock).mockImplementation((sql) => {
      if (sql.includes('SELECT id FROM "users"')) {
        return Promise.resolve({ rows: [{ id: 'user-123' }] });
      }
      return Promise.resolve({ rows: [{ id: 'pet-1' }, { id: 'pet-2' }] });
    });

    mockReq = {
      method: 'GET',
      query: {},
      body: {},
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith([{ id: 'pet-1' }, { id: 'pet-2' }]);
  });

  it('handles DELETE request', async () => {
    (query as jest.Mock).mockImplementation((sql) => {
      if (sql.includes('SELECT id FROM "users"')) {
        return Promise.resolve({ rows: [{ id: 'user-123' }] });
      }
      if (sql.includes('DELETE FROM "pets"')) {
        return Promise.resolve({ rowCount: 1 });
      }
      return Promise.resolve({ rows: [] });
    });

    mockReq = {
      method: 'DELETE',
      query: {},
      body: { id: 'pet-123' },
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ success: true });
  });
});
