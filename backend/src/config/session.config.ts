import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
// import Redis from 'ioredis';

// const RedisStore = connectRedis(session);

// Railway Redis клиент

// const redisClient = new Redis({
//   host: 'redis-production-5266.up.railway.app',
//   port: 6379,
//   password: 'jBYeYZGOvpeHufyGWTqCjVCXZomWDqNV',
//   tls: {},
// });
// export const sessionOptions: session.SessionOptions = {
//   store: new RedisStore({ client: redisClient }),
//   secret: process.env.SESSION_SECRET || 'your-secret-key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24, // 1 день
//     httpOnly: true,
//     sameSite: 'lax',
//     secure: true, // включаем для HTTPS в Railway
//   },
// };


export const sessionOptions: session.SessionOptions = {
  store: new session.MemoryStore(),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 день
    httpOnly: true,
    sameSite: 'lax',             // или 'none' при кросс-домене
    secure: false,               // true — в production с HTTPS
  },
};
