-- TODO: change public schema owner for added security
ALTER SCHEMA public OWNER TO ":DATABASE_OWNER";

BEGIN;
-- Install extensions
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMIT;

-- Allow starter-server-authentication to switch to starter-server
GRANT ":SERVER_ROLE" TO ":SERVER_AUTHENTICATOR_ROLE";

-- First migration: drop everything and start from scratch
DROP SCHEMA IF EXISTS ":DB_SCHEMA_NAME" CASCADE;

-- we dont want untrusted roles to be able to install or modify things in the pblic schema
REVOKE ALL ON SCHEMA public FROM public;

ALTER DEFAULT privileges REVOKE ALL ON sequences FROM public;

ALTER DEFAULT privileges REVOKE ALL ON functions FROM public;

-- give access to the public schema to the DB owner role
GRANT ALL ON SCHEMA public TO ":DATABASE_OWNER";

CREATE SCHEMA ":DB_SCHEMA_NAME";

GRANT usage ON SCHEMA public, ":DB_SCHEMA_NAME" TO ":SERVER_ROLE";

ALTER DEFAULT privileges IN SCHEMA public, ":DB_SCHEMA_NAME" GRANT usage,
SELECT
  ON sequences TO ":SERVER_ROLE";

ALTER DEFAULT privileges IN SCHEMA public, ":DB_SCHEMA_NAME" GRANT EXECUTE ON functions TO ":SERVER_ROLE";

CREATE TABLE ":DB_SCHEMA_NAME".users (id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), username text NOT NULL, password
  text NOT NULL, email text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL
  DEFAULT now()
);

GRANT SELECT, UPDATE ON ":DB_SCHEMA_NAME".users TO ":SERVER_ROLE";

--test
