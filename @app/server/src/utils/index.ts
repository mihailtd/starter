export function sanitizeEnv() {
  const requiredEnvvars = [
    "DATABASE_URL",
    "NODE_ENV",
  ];
  requiredEnvvars.forEach((envvar) => {
    if (!process.env[envvar]) {
      throw new Error(
        `Could not find process.env.${envvar} - did you remember to run the setup script? Have you sourced the environmental variables file '.env'?`
      );
    }
  });
}
