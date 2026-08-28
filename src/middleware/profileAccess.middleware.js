const CustomerProfile = require("../models/customerProfile.model");
const TrainerProfile = require("../models/trainerProfile.model");

function loadProfile(getById) {
  return async (req, res, next) => {
    try {
      const profile = await getById(req.params.id);
      if (!profile)
        return res.status(404).json({ message: "Profile not found" });
      req.profile = profile;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

function authorizeProfileOwnerOrRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (allowedRoles.includes(req.user.role)) return next();
    if (String(req.profile.user_id) === String(req.user.id)) return next();
    return res.status(403).json({ message: "Forbidden" });
  };
}

module.exports = {
  loadCustomerProfile: loadProfile(CustomerProfile.getCustomerById),
  loadTrainerProfile: loadProfile(TrainerProfile.getTrainerById),
  authorizeProfileOwnerOrRole,
};
