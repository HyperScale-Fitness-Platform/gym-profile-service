const request = require("supertest");
const app = require("../../src/app");

jest.mock("../../src/models/customerProfile.model", () => ({
  createCustomerProfile: jest.fn(),
  getCustomerById: jest.fn(),
  updateCustomer: jest.fn(),
  deleteCustomer: jest.fn(),
  listCustomers: jest.fn(),
}));

jest.mock("../../src/models/trainerProfile.model", () => ({
  createTrainerProfile: jest.fn(),
  getTrainerById: jest.fn(),
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
  listCustomers,
} = require("../../src/models/customerProfile.model");

const {
  createTrainerProfile,
  getTrainerById,
  listTrainers,
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
    const profile = {
      id: "user-123",
      full_name: "Jane Doe",
      gender: "female",
      phone: "555-1234",
    };
    createCustomerProfile.mockResolvedValue(profile);

    const response = await request(app)
      .post("/api/profiles/customers")
      .set("user-id", "test-user")
      .send({
        id: "user-123",
        full_name: "Jane Doe",
        gender: "female",
        phone: "555-1234",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(profile);
    expect(createCustomerProfile).toHaveBeenCalledWith({
      id: "user-123",
      full_name: "Jane Doe",
      gender: "female",
      phone: "555-1234",
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

  it("should list customer profiles", async () => {
    const profiles = [
      {
        id: "user-123",
        full_name: "Jane Doe",
        gender: "female",
        phone: "555-1234",
      },
    ];
    listCustomers.mockResolvedValue(profiles);

    const response = await request(app)
      .get("/api/profiles/customers")
      .set("user-id", "test-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(profiles);
    expect(listCustomers).toHaveBeenCalledWith({ limit: undefined, offset: undefined });
  });
});

describe("Integration: /api/profiles/trainers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a trainer profile", async () => {
    const profile = { id: "t1", full_name: "Alex" };
    createTrainerProfile.mockResolvedValue(profile);

    const response = await request(app)
      .post("/api/profiles/trainers")
      .set("user-id", "test-user")
      .send({ id: "t1", email: "alex@example.com", password: "secret", full_name: "Alex" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(profile);
    expect(createTrainerProfile).toHaveBeenCalledWith(
      expect.objectContaining({ id: "t1", full_name: "Alex" }),
    );
  });

  it("should return a trainer profile by id", async () => {
    const profile = { id: "t1", full_name: "Alex" };
    getTrainerById.mockResolvedValue(profile);

    const response = await request(app)
      .get("/api/profiles/trainers/t1")
      .set("user-id", "test-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(profile);
    expect(getTrainerById).toHaveBeenCalledWith("t1");
  });

  it("should list trainer profiles", async () => {
    const profiles = [{ id: "t1", full_name: "Alex" }];
    listTrainers.mockResolvedValue(profiles);

    const response = await request(app)
      .get("/api/profiles/trainers")
      .set("user-id", "test-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(profiles);
    expect(listTrainers).toHaveBeenCalled();
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
