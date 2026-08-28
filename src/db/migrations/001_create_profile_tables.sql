-- Create initial profile-service schema for PostgreSQL

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS customer_profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL,
  phone text,
  date_of_birth date,
  gender text,
  photo_url text
);

CREATE TABLE IF NOT EXISTS trainer_profiles (
  id uuid PRIMARY KEY, 
  full_name text NOT NULL,
  bio text,
  gender text,
  photo_url text
);
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text,
  file_url text,
  issued_date date
);