const {
  createCustomer,
  getCustomerByIdHandler,
} = require("../../src/controllers/profile.controller");

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
} = require("../../src/models/customerProfile.model");

describe("profile.controller", () => {
  let res;
  let next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("createCustomer", () => {
    it("should create a customer profile and return 201", async () => {
      const profile = {
        id: "user-123",
        full_name: "Jane Doe",
        gender: "female",
        phone: "555-1234",
      };
      createCustomerProfile.mockResolvedValue(profile);

      const req = {
        body: {
          id: "user-123",
          full_name: "Jane Doe",
          gender: "female",
          phone: "555-1234",
        },
      };

      await createCustomer(req, res, next);

      expect(createCustomerProfile).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(profile);
      expect(next).not.toHaveBeenCalled();
    });

    it("should forward errors to next", async () => {
      const error = new Error("create failed");
      createCustomerProfile.mockRejectedValue(error);

      const req = {
        body: { id: "user-123", full_name: "Jane Doe", gender: "female" },
      };

      await createCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getCustomerByIdHandler", () => {
    it("should return the customer profile when found", async () => {
      const profile = {
        id: "user-123",
        full_name: "Jane Doe",
        gender: "female",
        phone: "555-1234",
      };
      getCustomerById.mockResolvedValue(profile);

      const req = { params: { id: "user-123" } };

      await getCustomerByIdHandler(req, res, next);

      expect(getCustomerById).toHaveBeenCalledWith("user-123");
      expect(res.json).toHaveBeenCalledWith(profile);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 404 when the profile is not found", async () => {
      getCustomerById.mockResolvedValue(null);

      const req = { params: { id: "abc" } };

      await getCustomerByIdHandler(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer profile not found",
      });
    });

    it("should forward errors to next", async () => {
      const error = new Error("lookup failed");
      getCustomerById.mockRejectedValue(error);

      const req = { params: { id: "user-123" } };

      await getCustomerByIdHandler(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("trainer handlers", () => {
    const {
      createTrainerProfile,
      getTrainerById,
    } = require("../../src/models/trainerProfile.model");

    it("should create a trainer profile and return 201", async () => {
      const profile = { id: "t1", full_name: "Alex" };
      createTrainerProfile.mockResolvedValue(profile);

      const req = {
        body: { id: "t1", email: "alex@example.com", password: "secret", full_name: "Alex" },
      };

      await require("../../src/controllers/profile.controller").createTrainer(
        req,
        res,
        next,
      );

      expect(createTrainerProfile).toHaveBeenCalledWith(
        expect.objectContaining({ id: "t1", full_name: "Alex" }),
      );
      expect(createTrainerProfile.mock.calls[0][0].password).not.toBe("secret");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(profile);
      expect(next).not.toHaveBeenCalled();
    });

    it("should return trainer profile by id", async () => {
      const profile = { id: "t1", full_name: "Alex" };
      getTrainerById.mockResolvedValue(profile);

      const req = { params: { id: "t1" } };

      await require("../../src/controllers/profile.controller").getTrainerByIdHandler(
        req,
        res,
        next,
      );

      expect(getTrainerById).toHaveBeenCalledWith("t1");
      expect(res.json).toHaveBeenCalledWith(profile);
    });
  });

  describe("certification handlers", () => {
    const {
      createCertification,
      getCertificationById,
      listCertificationsByTrainer,
    } = require("../../src/models/certification.model");

    it("should create a certification and return 201", async () => {
      const certification = { id: "c1", title: "Cert A", trainer_id: "t1" };
      createCertification.mockResolvedValue(certification);

      const req = { body: { trainer_id: "t1", title: "Cert A" } };

      await require("../../src/controllers/profile.controller").createCertificationEntry(
        req,
        res,
        next,
      );

      expect(createCertification).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(certification);
    });

    it("should return certification list by trainer id", async () => {
      const certifications = [{ id: "c1", title: "Cert A", trainer_id: "t1" }];
      listCertificationsByTrainer.mockResolvedValue(certifications);

      const req = {
        params: { trainerId: "t1" },
        query: { limit: 10, offset: 0 },
      };

      await require("../../src/controllers/profile.controller").listCertifications(
        req,
        res,
        next,
      );

      expect(listCertificationsByTrainer).toHaveBeenCalledWith("t1", {
        limit: 10,
        offset: 0,
      });
      expect(res.json).toHaveBeenCalledWith(certifications);
    });

    it("should return certification by id", async () => {
      const certification = { id: "c1", title: "Cert A", trainer_id: "t1" };
      getCertificationById.mockResolvedValue(certification);

      const req = { params: { id: "c1" } };

      await require("../../src/controllers/profile.controller").getCertification(
        req,
        res,
        next,
      );

      expect(getCertificationById).toHaveBeenCalledWith("c1");
      expect(res.json).toHaveBeenCalledWith(certification);
    });
  });
});
