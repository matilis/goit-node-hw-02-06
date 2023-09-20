const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../service/schemas/users");
require("dotenv").config();
const { DB_HOST } = process.env;

describe("Integration Tests: User Registration & Login", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("User Registration", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/api/users/signup").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe("testuser@example.com");

      await User.findOneAndRemove({ email: "testuser@example.com" });
    });
  });

  describe("User Login", () => {
    beforeAll(async () => {
      await request(app).post("/api/users/signup").send({
        email: "testuser@example.com",
        password: "password123",
      });
    });

    afterAll(async () => {
      await User.findOneAndRemove({ email: "testuser@example.com" });
    });

    it("should login an existing user", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should fail to login with incorrect credentials", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "testuser@example.com",
        password: "incorrectpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Error! Email or password is wrong!"
      );
    });
  });
});
