type Config = {
  jwtSecret: string;
  port: number;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    type: string;
    database: string;
  };
  throttler: {
    ttl: number;
    limit: number;
  };
};

export default (): Config => ({
  jwtSecret: process.env.JWT_SECRET || 'my_test_secret_key',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 5432,
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    type: process.env.DATABASE_TYPE || 'postgres',
    database: process.env.POSTGRES_DB || 'kupipodariday',
  },
  throttler: {
    ttl: process.env.THROTTLER_TTL
      ? parseInt(process.env.THROTTLER_TTL)
      : 60000,
    limit: process.env.THROTTLER_LIMIT
      ? parseInt(process.env.THROTTLER_LIMIT)
      : 100,
  },
});
