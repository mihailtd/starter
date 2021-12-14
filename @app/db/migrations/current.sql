-- Allow starter-server-authentication to switch to starter-server
GRANT :SERVER_ROLE TO :SERVER_AUTHENTICATOR_ROLE;

-- First migration: drop everything and start from scratch
DROP SCHEMA IF EXISTS :DB_SCHEMA_NAME CASCADE;

-- we dont want untrusted roles to be able to install or modify things in the pblic schema
REVOKE ALL ON SCHEMA public FROM public;

ALTER DEFAULT privileges REVOKE ALL ON sequences FROM public;

ALTER DEFAULT privileges REVOKE ALL ON functions FROM public;

-- give access to the public schema to the DB owner role
GRANT ALL ON SCHEMA public TO :DATABASE_OWNER;

CREATE SCHEMA :DB_SCHEMA_NAME;

GRANT usage ON SCHEMA public, :DB_SCHEMA_NAME TO :SERVER_ROLE;

ALTER DEFAULT privileges IN SCHEMA public, :DB_SCHEMA_NAME GRANT usage,
SELECT
  ON sequences TO :SERVER_ROLE;

ALTER DEFAULT privileges IN SCHEMA public, :DB_SCHEMA_NAME GRANT EXECUTE ON functions TO :SERVER_ROLE;
