import 'dotenv/config';

function checkRequiredEnvVariables(key: string): string {
  const value = process.env[key];
  if(!value){
    throw new Error(`Missing env variables for ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: checkRequiredEnvVariables("DATABASE_URL"),
  userSecret: checkRequiredEnvVariables("USER_SECRET"),
  adminSecret: checkRequiredEnvVariables("ADMIN_SECRET")
} as const;