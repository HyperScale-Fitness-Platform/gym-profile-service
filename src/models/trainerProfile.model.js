const { pool } = require("../config/database");

async function createTrainerProfile({
  user_id,
  full_name,
  bio,
  specialty,
  gender,
  photo_url,
}) {
  const res = await pool.query(
    `INSERT INTO trainer_profiles (user_id, full_name, bio, specialty, gender, photo_url)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [user_id, full_name, bio, specialty, gender, photo_url],
  );
  return res.rows[0];
}

async function getTrainerById(id) {
  const res = await pool.query("SELECT * FROM trainer_profiles WHERE id=$1", [
    id,
  ]);
  return res.rows[0] || null;
}

async function getTrainerByUserId(user_id) {
  const res = await pool.query(
    "SELECT * FROM trainer_profiles WHERE user_id=$1",
    [user_id],
  );
  return res.rows[0] || null;
}

async function updateTrainer(id, fields = {}) {
  const allowed = ["full_name", "bio", "specialty", "gender", "photo_url"];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (keys.length === 0) return getTrainerById(id);

  const set = keys.map((k, i) => `${k}=$${i + 1}`);
  const values = keys.map((k) => fields[k]);
  values.push(id);

  const q = `UPDATE trainer_profiles SET ${set.join(", ")} WHERE id=$${values.length} RETURNING *`;
  const res = await pool.query(q, values);
  return res.rows[0] || null;
}

async function deleteTrainer(id) {
  await pool.query("DELETE FROM trainer_profiles WHERE id=$1", [id]);
  return true;
}

async function listTrainers({ limit = 50, offset = 0 } = {}) {
  const res = await pool.query(
    "SELECT * FROM trainer_profiles ORDER BY full_name LIMIT $1 OFFSET $2",
    [limit, offset],
  );
  return res.rows;
}

module.exports = {
  createTrainerProfile,
  getTrainerById,
  getTrainerByUserId,
  updateTrainer,
  deleteTrainer,
  listTrainers,
};
