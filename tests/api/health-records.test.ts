// tests/api/health-records.test.ts
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
import handler from "../../pages/api/health-records";
import { query } from "../../lib/db";

describe("/api/health-records API", () => {
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

  describe("GET /api/health-records", () => {
    it("should return 401 if not logged in", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue(null);

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: "未登录" });
    });

    it("should return health records for specific pet", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query
      query.mockResolvedValueOnce({ rows: [{ id: "pet-1" }] }); // pet check
      query.mockResolvedValueOnce({ rows: [{ id: "record-1", title: "Vaccination" }] }); // records query

      mockReq.query = { petId: "pet-1" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([{ id: "record-1", title: "Vaccination" }]);
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

    it("should return all health records for user's pets", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query
      query.mockResolvedValueOnce({ rows: [{ id: "record-1" }, { id: "record-2" }] }); // records query

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([{ id: "record-1" }, { id: "record-2" }]);
    });
  });

  describe("POST /api/health-records", () => {
    it("should create a new health record", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query
      query.mockResolvedValueOnce({ rows: [{ id: "pet-1" }] }); // pet check
      query.mockResolvedValueOnce({ rows: [{ id: "record-1", title: "Vaccination" }] }); // insert

      mockReq.method = "POST";
      mockReq.body = {
        petId: "pet-1",
        recordType: "vaccination",
        title: "Annual Vaccination",
        recordDate: "2024-01-01",
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
        // missing recordType, title, recordDate
      };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "petId, recordType, title, recordDate 为必填项" });
    });
  });

  describe("DELETE /api/health-records", () => {
    it("should delete a health record", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query
      query.mockResolvedValueOnce({ rows: [{ id: "record-1" }] }); // record check
      query.mockResolvedValueOnce({ rowCount: 1 }); // delete

      mockReq.method = "DELETE";
      mockReq.query = { id: "record-1" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true });
    });

    it("should return 400 if id is missing", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query

      mockReq.method = "DELETE";
      mockReq.query = {}; // no id

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "id 为必填项" });
    });

    it("should return 404 if record doesn't exist or no permission", async () => {
      const { getServerSession } = require("next-auth/next");
      getServerSession.mockResolvedValue({
        user: { email: "test@example.com" },
      });

      const { query } = require("../../lib/db");
      query.mockResolvedValueOnce({ rows: [{ id: "user-1" }] }); // user query
      query.mockResolvedValueOnce({ rows: [] }); // record check - empty

      mockReq.method = "DELETE";
      mockReq.query = { id: "record-1" };

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: "记录不存在或无权限" });
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

      mockReq.method = "PUT";

      await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(405);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Method not allowed" });
    });
  });
});
