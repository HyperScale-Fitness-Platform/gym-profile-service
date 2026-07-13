const request = require("supertest");
const app = require("../../src/app");

jest.mock("../../src/models/customerProfile.model", () => ({
  createCustomerProfile: jest.fn(),
  getCustomerById: jest.fn(),
  getCustomerByUserId: jest.fn(),
  updateCustomer: jest.fn(),
  deleteCustomer: jest.fn(),
  listCustomers: jest.fn(),
}));

jest.mock("../../src/models/trainerProfile.model", () => ({
  createTrainerProfile: jest.fn(),
  getTrainerById: jest.fn(),
  getTrainerByUserId: jest.fn(),
  updateTrainer: jest.fn(),
  deleteTrainer: jest.fn(),
  listTrainers: jest.fn(),
}));

jest.mock("../../src/models/certification.model", () => ({
  createCertification: jest.fn(),
  getCertificationById: jest.fn(),
  listCertificationsByTrainer: jest.fn(),
  updateCertification: jest.fn(),
  deleteCertification: jest.fn(),
}));

const {
  createCustomerProfile,
  getCustomerById,
  getCustomerByUserId,
} = require("../../src/models/customerProfile.model");

const {
  createTrainerProfile,
  getTrainerById,
  getTrainerByUserId,
} = require("../../src/models/trainerProfile.model");

const {
  createCertification,
  getCertificationById,
  listCertificationsByTrainer,
} = require("../../src/models/certification.model");

describe("Integration: /api/profiles/customers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a customer profile", async () => {
    const profile = { id: "abc", user_id: "user-123", full_name: "Jane Doe" };
    createCustomerProfile.mockResolvedValue(profile);

    const response = await request(app)
      .post("/api/profiles/customers")
      .set("user-id", "test-user")
      .send({ user_id: "user-123", full_name: "Jane Doe" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(profile);
    expect(createCustomerProfile).toHaveBeenCalledWith({
      user_id: "user-123",
      full_name: "Jane Doe",
    });
  });

  it("should return 404 when customer not found by id", async () => {
    getCustomerById.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/profiles/customers/abc")
      .set("user-id", "test-user");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Customer profile not found" });
  });

  it("should return a customer profile by user_id", async () => {
    const profile = { id: "abc", user_id: "user-123", full_name: "Jane Doe" };
    getCustomerByUserId.mockResolvedValue(profile);

    const response = await request(app)
      .get("/api/profiles/customers/by-user/user-123")
      .set("user-id", "test-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(profile);
    expect(getCustomerByUserId).toHaveBeenCalledWith("user-123");
  });
});

describe("Integration: /api/profiles/trainers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a trainer profile", async () => {
    const profile = { id: "t1", user_id: "trainer-123", full_name: "Alex" };
    createTrainerProfile.mockResolvedValue(profile);

    const response = await request(app)
      .post("/api/profiles/trainers")
      .set("user-id", "test-user")
      .send({ user_id: "trainer-123", full_name: "Alex" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(profile);
    expect(createTrainerProfile).toHaveBeenCalledWith({
      user_id: "trainer-123",
      full_name: "Alex",
    });
  });

  it("should return a trainer profile by id", async () => {
    const profile = { id: "t1", user_id: "trainer-123", full_name: "Alex" };
    getTrainerById.mockResolvedValue(profile);

    const response = await request(app)
      .get("/api/profiles/trainers/t1")
      .set("user-id", "test-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(profile);
    expect(getTrainerById).toHaveBeenCalledWith("t1");
  });

  it("should return a trainer profile by user_id", async () => {
    const profile = { id: "t1", user_id: "trainer-123", full_name: "Alex" };
    getTrainerByUserId.mockResolvedValue(profile);

    const response = await request(app)
      .get("/api/profiles/trainers/by-user/trainer-123")
      .set("user-id", "test-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(profile);
    expect(getTrainerByUserId).toHaveBeenCalledWith("trainer-123");
  });
});

describe("Integration: /api/profiles/certifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a certification", async () => {
    const certification = { id: "c1", trainer_id: "t1", title: "Cert A" };
    createCertification.mockResolvedValue(certification);

    const response = await request(app)
      .post("/api/profiles/certifications")
      .set("user-id", "test-user")
      .send({ trainer_id: "t1", title: "Cert A" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(certification);
    expect(createCertification).toHaveBeenCalledWith({
      trainer_id: "t1",
      title: "Cert A",
    });
  });

  it("should list certifications by trainer", async () => {
    const certifications = [{ id: "c1", trainer_id: "t1", title: "Cert A" }];
    listCertificationsByTrainer.mockResolvedValue(certifications);

    const response = await request(app)
      .get("/api/profiles/trainers/t1/certifications")
      .set("user-id", "test-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(certifications);
    expect(listCertificationsByTrainer).toHaveBeenCalledWith("t1", {
      limit: undefined,
      offset: undefined,
    });
  });

  it("should return a certification by id", async () => {
    const certification = { id: "c1", trainer_id: "t1", title: "Cert A" };
    getCertificationById.mockResolvedValue(certification);

    const response = await request(app)
      .get("/api/profiles/certifications/c1")
      .set("user-id", "test-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(certification);
    expect(getCertificationById).toHaveBeenCalledWith("c1");
  });
});
