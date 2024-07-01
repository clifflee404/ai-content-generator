/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    // url: process.env.DB_URL,
    url: "postgresql://ai-content-generator_owner:iqA0IVDye2GN@ep-shy-waterfall-a5m17w56.us-east-2.aws.neon.tech/ai-content-generator?sslmode=require"
  }
};