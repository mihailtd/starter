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

GRANT ALL ON SCHEMA ":DB_SCHEMA_NAME" TO ":SERVER_ROLE";

ALTER DEFAULT privileges IN SCHEMA public, ":DB_SCHEMA_NAME" GRANT usage,
SELECT
  ON sequences TO ":SERVER_ROLE";

ALTER DEFAULT privileges IN SCHEMA public, ":DB_SCHEMA_NAME" GRANT EXECUTE ON functions TO ":SERVER_ROLE";

-- function used to determine user ID used for RLS
CREATE OR REPLACE FUNCTION ":DB_SCHEMA_NAME".current_user_id ()
  RETURNS uuid
  LANGUAGE SQL
  STABLE
  AS $function$
  SELECT
    nullif (current_setting('jwt.claims.user_id', TRUE), '')::uuid;

$function$;

DROP TABLE IF EXISTS ":DB_SCHEMA_NAME".users;

CREATE TABLE ":DB_SCHEMA_NAME".users (id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (), username text, email text NOT
  NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON ":DB_SCHEMA_NAME".users TO ":SERVER_ROLE";

ALTER TABLE ":DB_SCHEMA_NAME".users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_user ON ":DB_SCHEMA_NAME".users;

CREATE POLICY users_user ON ":DB_SCHEMA_NAME".users TO ":SERVER_ROLE"
  USING (":DB_SCHEMA_NAME".current_user_id () = "id")
  WITH CHECK ("id" = ":DB_SCHEMA_NAME".current_user_id ());
