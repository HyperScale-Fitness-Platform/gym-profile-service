const bcrypt = require("bcrypt");
const {
  createCustomerProfile,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  listCustomers,
} = require("../models/customerProfile.model");

const {
  createTrainerProfile,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  listTrainers,
} = require("../models/trainerProfile.model");

const {
  createCertification,
  getCertificationById,
  listCertificationsByTrainer,
  updateCertification,
  deleteCertification,
} = require("../models/certification.model");

async function createCustomer(req, res, next) {
  try {
    const profile = await createCustomerProfile(req.body);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
}

async function getCustomerByIdHandler(req, res, next) {
  try {
    const profile = await getCustomerById(req.params.id);
    if (!profile)
      return res.status(404).json({ message: "Customer profile not found" });
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function updateCustomerProfile(req, res, next) {
  try {
    const profile = await updateCustomer(req.params.id, req.body);
    if (!profile)
      return res.status(404).json({ message: "Customer profile not found" });
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function removeCustomer(req, res, next) {
  try {
    await deleteCustomer(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function listCustomerProfiles(req, res, next) {
  try {
    const profiles = await listCustomers({
      limit: req.query.limit,
      offset: req.query.offset,
    });
    res.json(profiles);
  } catch (error) {
    next(error);
  }
}

async function createTrainer(req, res, next) {
  try {
    const { password, ...otherData } = req.body;
    
    // Hash password before db insertion
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const profile = await createTrainerProfile({
      ...otherData,
      password: hashedPassword
    });

    // Defensively strip password from the response object
    delete profile.password;

    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
}
async function getTrainerByIdHandler(req, res, next) {
  try {
    const profile = await getTrainerById(req.params.id);
    if (!profile)
      return res.status(404).json({ message: "Trainer profile not found" });
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function updateTrainerProfile(req, res, next) {
  try {

    const profile = await updateTrainer(req.params.id, req.body);
    
    if (!profile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function removeTrainer(req, res, next) {
  try {
    await deleteTrainer(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function listTrainerProfiles(req, res, next) {
  try {
    const profiles = await listTrainers();
    res.json(profiles);
  } catch (error) {
    next(error);
  }
}

async function createCertificationEntry(req, res, next) {
  try {
    const certification = await createCertification(req.body);
    res.status(201).json(certification);
  } catch (error) {
    next(error);
  }
}

async function getCertification(req, res, next) {
  try {
    const certification = await getCertificationById(req.params.id);
    if (!certification)
      return res.status(404).json({ message: "Certification not found" });
    res.json(certification);
  } catch (error) {
    next(error);
  }
}

async function listCertifications(req, res, next) {
  try {
    const certifications = await listCertificationsByTrainer(
      req.params.trainerId,
      {
        limit: req.query.limit,
        offset: req.query.offset,
      },
    );
    res.json(certifications);
  } catch (error) {
    next(error);
  }
}

async function updateCertificationEntry(req, res, next) {
  try {
    const certification = await updateCertification(req.params.id, req.body);
    if (!certification)
      return res.status(404).json({ message: "Certification not found" });
    res.json(certification);
  } catch (error) {
    next(error);
  }
}

async function removeCertification(req, res, next) {
  try {
    await deleteCertification(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCustomer,
  getCustomerByIdHandler,
  updateCustomerProfile,
  removeCustomer,
  listCustomerProfiles,
  createTrainer,
  getTrainerByIdHandler,
  updateTrainerProfile,
  removeTrainer,
  listTrainerProfiles,
  createCertificationEntry,
  getCertification,
  listCertifications,
  updateCertificationEntry,
  removeCertification,
};
