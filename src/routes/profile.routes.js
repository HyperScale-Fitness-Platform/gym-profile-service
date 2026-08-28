const express = require("express");
const profileController = require("../controllers/profile.controller");
const validateRequest = require("../middleware/validateRequest.middleware");
const { authorizeSelfOrRole } = require("../middleware/role.middleware");
const {
  loadCustomerProfile,
  loadTrainerProfile,
  authorizeProfileOwnerOrRole,
} = require("../middleware/profileAccess.middleware");

const router = express.Router();

router.post(
  "/customers",
  validateRequest(["id", "full_name"]),
  profileController.createCustomer,
);
router.get("/customers", profileController.listCustomerProfiles);
router.get("/customers/:id", profileController.getCustomerByIdHandler);
router.put("/customers/:id", profileController.updateCustomerProfile);
router.delete("/customers/:id", profileController.removeCustomer);

// --- TRAINER ROUTES UPDATED ---
router.post(
  "/trainers",
  validateRequest(["email", "password", "full_name"]), // Updated required fields
  profileController.createTrainer,
);
router.get("/trainers", profileController.listTrainerProfiles);
router.get("/trainers/:id", profileController.getTrainerByIdHandler);
// Removed: router.get("/trainers/by-user/:user_id" ...)
router.put("/trainers/:id", profileController.updateTrainerProfile);
router.delete("/trainers/:id", profileController.removeTrainer);

router.post(
  "/certifications",
  validateRequest(["trainer_id", "title"]),
  authorizeSelfOrRole(["admin"], ["body.trainer_id"]),
  profileController.createCertificationEntry,
);
router.get(
  "/trainers/:trainerId/certifications",
  profileController.listCertifications,
);
router.get("/certifications/:id", profileController.getCertification);
router.put(
  "/certifications/:id",
  authorizeSelfOrRole(["admin"], ["body.trainer_id"]),
  profileController.updateCertificationEntry,
);
router.delete(
  "/certifications/:id",
  authorizeSelfOrRole(["admin"], ["body.trainer_id"]),
  profileController.removeCertification,
);

module.exports = router;