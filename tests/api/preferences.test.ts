// tests/api/preferences.test.ts
// Mock modules BEFORE importing the handler
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("../../lib/db", () => ({
  query: jest.fn(),
}));

jest.mock("../../pages/api/auth/[...nextauth]", () => ({
  authOptions: {},
}));

import { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/preferences";
import { query } from "../../lib/db";

describe("/api/preferences API", () => {
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
      body: {},
    };
    
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe("GET /api/preferences", () => {
    it("should return 401 if not logged in", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue(null);

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: "未登录" });
    });

    it("should return preferences for specific pet", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query
      query.mockResolvedValueOnce({ rows: [{ id: "pet-1" }] }); // pet check
      query.mockResolvedValueOnce({ rows: [{ id: "pref-1", category: "food" }] }); // preferences query

      mockReq.query = { petId: "pet-1" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([{ id: "pref-1", category: "food" }]);
    });

    it("should return 403 if pet doesn't belong to user", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query
      query.mockResolvedValueOnce({ rows: [] }); // pet check - empty

      mockReq.query = { petId: "pet-1" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({ error: "无权限" });
    });
  });

  describe("POST /api/preferences", () => {
    it("should create a new preference", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query
      query.mockResolvedValueOnce({ rows: [{ id: "pet-1" }] }); // pet check
      query.mockResolvedValueOnce({ rows: [{ id: "pref-1", category: "food" }] }); // insert

      mockReq.method = "POST";
      mockReq.body = {
        petId: "pet-1",
        category: "food",
      };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it("should return 400 if missing required fields", async () => {
      const { getServerSession } = require("next-auth/next");
      const { query } = require("../../lib/db");
      
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });
      
      // Mock user query for getSessionUser
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] });

      mockReq.method = "POST";
      mockReq.body = {
        petId: "pet-1",
        // missing category
      };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "petId 和 category 为必填项" });
    });
  });

  describe("Method not allowed", () => {
    it("should return 405 for unsupported methods", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query

      mockReq.method = "DELETE";

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(405);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Method not allowed" });
    });
  });
});
