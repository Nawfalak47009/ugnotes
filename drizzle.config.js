/**@type { import("drizzle-kit").Config} */
export default {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://ugnotes_owner:i5DmnNYPK4WL@ep-icy-pond-a5mqtq4a.us-east-2.aws.neon.tech/ugnotes?sslmode=require',
    }
}