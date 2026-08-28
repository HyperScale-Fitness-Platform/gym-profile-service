const { pool } = require("../config/database");

async function createCustomerProfile({
  id,
  full_name,
  phone,
  gender,
}) {
  const res = await pool.query(
    `INSERT INTO customer_profiles (id,full_name, phone, gender)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [id, full_name, phone, gender],
  );
  return res.rows[0];
}

async function getCustomerById(id) {
  const res = await pool.query("SELECT * FROM customer_profiles WHERE id=$1", [
    id,
  ]);
  return res.rows[0] || null;
}

async function updateCustomer(id, fields = {}) {
  const allowed = ["full_name", "phone", "gender"];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (keys.length === 0) return getCustomerById(id);

  const set = keys.map((k, i) => `${k}=$${i + 1}`);
  const values = keys.map((k) => fields[k]);
  values.push(id);

  const q = `UPDATE customer_profiles SET ${set.join(", ")} WHERE id=$${values.length} RETURNING *`;
  const res = await pool.query(q, values);
  return res.rows[0] || null;
}

async function deleteCustomer(id) {
  await pool.query("DELETE FROM customer_profiles WHERE id=$1", [id]);
  return true;
}

async function listCustomers({ limit = 50, offset = 0 } = {}) {
  const res = await pool.query(
    "SELECT * FROM customer_profiles ORDER BY full_name LIMIT $1 OFFSET $2",
    [limit, offset],
  );
  return res.rows;
}

async function deleteCustomerProfile(id) {
  await pool.query("DELETE FROM customer_profiles WHERE id = $1", [id]);
}

module.exports = {
  createCustomerProfile,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  listCustomers,
  deleteCustomerProfile
};
