const { pool } = require("../config/database");

async function createCertification({
  trainer_id,
  title,
  issuer,
  file_url,
  issued_date,
}) {
  const res = await pool.query(
    `INSERT INTO certifications (trainer_id, title, issuer, file_url, issued_date)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [trainer_id, title, issuer, file_url, issued_date],
  );
  return res.rows[0];
}

async function getCertificationById(id) {
  const res = await pool.query("SELECT * FROM certifications WHERE id=$1", [
    id,
  ]);
  return res.rows[0] || null;
}

async function listCertificationsByTrainer(
  trainer_id,
  { limit = 50, offset = 0 } = {},
) {
  const res = await pool.query(
    "SELECT * FROM certifications WHERE trainer_id=$1 ORDER BY issued_date DESC LIMIT $2 OFFSET $3",
    [trainer_id, limit, offset],
  );
  return res.rows;
}

async function updateCertification(id, fields = {}) {
  const allowed = ["title", "issuer", "file_url", "issued_date"];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (keys.length === 0) return getCertificationById(id);

  const set = keys.map((k, i) => `${k}=$${i + 1}`);
  const values = keys.map((k) => fields[k]);
  values.push(id);

  const q = `UPDATE certifications SET ${set.join(", ")} WHERE id=$${values.length} RETURNING *`;
  const res = await pool.query(q, values);
  return res.rows[0] || null;
}

async function deleteCertification(id) {
  await pool.query("DELETE FROM certifications WHERE id=$1", [id]);
  return true;
}

module.exports = {
  createCertification,
  getCertificationById,
  listCertificationsByTrainer,
  updateCertification,
  deleteCertification,
};
