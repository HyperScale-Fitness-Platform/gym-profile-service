const express = require("express");
const profileController = require("../controllers/profile.controller");
const validateRequest = require("../middleware/validateRequest.middleware");

const router = express.Router();

router.post(
  "/customers",
  validateRequest(["user_id", "full_name"]),
  profileController.createCustomer,
);
router.get("/customers", profileController.listCustomerProfiles);
router.get("/customers/:id", profileController.getCustomerByIdHandler);
router.get("/customers/by-user/:user_id", profileController.getCustomerByUserIdHandler);
router.put("/customers/:id", profileController.updateCustomerProfile);
router.delete("/customers/:id", profileController.removeCustomer);

router.post(
  "/trainers",
  validateRequest(["user_id", "full_name"]),
  profileController.createTrainer,
);
router.get("/trainers", profileController.listTrainerProfiles);
router.get("/trainers/:id", profileController.getTrainerByIdHandler);
router.get("/trainers/by-user/:user_id", profileController.getTrainerByUserIdHandler);
router.put("/trainers/:id", profileController.updateTrainerProfile);
router.delete("/trainers/:id", profileController.removeTrainer);

router.post(
  "/certifications",
  validateRequest(["trainer_id", "title"]),
  profileController.createCertificationEntry,
);
router.get(
  "/trainers/:trainerId/certifications",
  profileController.listCertifications,
);
router.get("/certifications/:id", profileController.getCertification);
router.put("/certifications/:id", profileController.updateCertificationEntry);
router.delete("/certifications/:id", profileController.removeCertification);

module.exports = router;
