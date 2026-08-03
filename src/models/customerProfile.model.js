const { pool } = require("../config/database");

async function createCustomerProfile({
  user_id,
  full_name,
  phone,
  date_of_birth,
  gender,
  photo_url,
}) {
  const res = await pool.query(
    `INSERT INTO customer_profiles (user_id, full_name, phone, date_of_birth, gender, photo_url)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [user_id, full_name, phone, date_of_birth, gender, photo_url],
  );
  return res.rows[0];
}

async function getCustomerById(id) {
  const res = await pool.query("SELECT * FROM customer_profiles WHERE id=$1", [
    id,
  ]);
  return res.rows[0] || null;
}

async function getCustomerByUserId(user_id) {
  const res = await pool.query(
    "SELECT * FROM customer_profiles WHERE user_id=$1",
    [user_id],
  );
  return res.rows[0] || null;
}

async function updateCustomer(id, fields = {}) {
  const allowed = [
    "full_name",
    "phone",
    "date_of_birth",
    "gender",
    "photo_url",
  ];
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
  getCustomerByUserId,
  updateCustomer,
  deleteCustomer,
  listCustomers,
  deleteCustomerProfile
};
