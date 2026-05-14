// tests/api/products.test.ts
import { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/products";
import { query } from "../../lib/db";

// Mock the db module
jest.mock("../../lib/db", () => ({
  query: jest.fn(),
}));

describe("/api/products API", () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockReq = {
      method: "GET",
      query: {},
    };
    
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("should return 405 for non-GET methods", async () => {
      mockReq.method = "POST";

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(405);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Method not allowed" });
    });

    it("should return single product when id is provided", async () => {
      const mockProduct = { id: "prod-1", name: "Dog Food", price: 99.99 };
      (query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });

      mockReq.query = { id: "prod-1" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ product: mockProduct });
    });

    it("should return 404 if product not found", async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      mockReq.query = { id: "non-existent" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Product not found" });
    });

    it("should return products list with filters", async () => {
      const mockProducts = [
        { id: "prod-1", name: "Dog Food", price: 99.99 },
        { id: "prod-2", name: "Cat Food", price: 79.99 },
      ];
      (query as jest.Mock)
        .mockResolvedValueOnce({ rows: mockProducts }) // products query
        .mockResolvedValueOnce({ rows: [{ count: "2" }] }); // count query

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        products: mockProducts,
        total: 2,
        limit: 20,
        offset: 0,
      });
    });

    it("should filter by category", async () => {
      const mockProducts = [{ id: "prod-1", name: "Dog Food" }];
      (query as jest.Mock)
        .mockResolvedValueOnce({ rows: mockProducts })
        .mockResolvedValueOnce({ rows: [{ count: "1" }] });

      mockReq.query = { category: "狗粮" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("p.category_name = $1"),
        expect.arrayContaining(["狗粮"])
      );
    });

    it("should filter by price range", async () => {
      const mockProducts: any[] = [];
      (query as jest.Mock)
        .mockResolvedValueOnce({ rows: mockProducts })
        .mockResolvedValueOnce({ rows: [{ count: "0" }] });

      mockReq.query = { minPrice: "50", maxPrice: "100" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("p.price >= $"),
        expect.arrayContaining([50])
      );
    });

    it("should filter by species", async () => {
      const mockProducts: any[] = [];
      (query as jest.Mock)
        .mockResolvedValueOnce({ rows: mockProducts })
        .mockResolvedValueOnce({ rows: [{ count: "0" }] });

      mockReq.query = { species: "狗" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("p.description ILIKE $"),
        expect.arrayContaining(["%狗%"])
      );
    });

    it("should search by keyword", async () => {
      const mockProducts: any[] = [];
      (query as jest.Mock)
        .mockResolvedValueOnce({ rows: mockProducts })
        .mockResolvedValueOnce({ rows: [{ count: "0" }] });

      mockReq.query = { search: "premium" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("p.name ILIKE $"),
        expect.arrayContaining(["%premium%"])
      );
    });

    it("should handle pagination", async () => {
      const mockProducts: any[] = [];
      (query as jest.Mock)
        .mockResolvedValueOnce({ rows: mockProducts })
        .mockResolvedValueOnce({ rows: [{ count: "100" }] });

      mockReq.query = { limit: "10", offset: "20" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 20,
        })
      );
    });

    it("should handle database errors", async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});
