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
  validateRequest(["user_id", "full_name"]),
  authorizeSelfOrRole(["admin"], ["body.user_id"]),
  profileController.createCustomer,
);
router.get("/customers", profileController.listCustomerProfiles);
router.get("/customers/:id", profileController.getCustomerByIdHandler);
router.get(
  "/customers/by-user/:user_id",
  profileController.getCustomerByUserIdHandler,
);
router.put(
  "/customers/:id",
  loadCustomerProfile,
  authorizeProfileOwnerOrRole(["admin"]),
  profileController.updateCustomerProfile,
);
router.delete(
  "/customers/:id",
  loadCustomerProfile,
  authorizeProfileOwnerOrRole(["admin"]),
  profileController.removeCustomer,
);

router.post(
  "/trainers",
  validateRequest(["user_id", "full_name"]),
  authorizeSelfOrRole(["admin"], ["body.user_id"]),
  profileController.createTrainer,
);
router.get("/trainers", profileController.listTrainerProfiles);
router.get("/trainers/:id", profileController.getTrainerByIdHandler);
router.get(
  "/trainers/by-user/:user_id",
  profileController.getTrainerByUserIdHandler,
);
router.put(
  "/trainers/:id",
  loadTrainerProfile,
  authorizeProfileOwnerOrRole(["admin"]),
  profileController.updateTrainerProfile,
);
router.delete(
  "/trainers/:id",
  loadTrainerProfile,
  authorizeProfileOwnerOrRole(["admin"]),
  profileController.removeTrainer,
);

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
