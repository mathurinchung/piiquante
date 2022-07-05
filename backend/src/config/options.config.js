const helmetOptions = { crossOriginResourcePolicy: false };

const corsOptions = { origin: process.env.CLIENT_URL, credentials: true };

module.exports = {
  helmetOptions,
  corsOptions
};
