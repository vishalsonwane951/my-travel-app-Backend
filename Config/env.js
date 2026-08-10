require('dotenv').config();

function required(name) {
  const val = process.env[name];
  if (!val) {
    console.warn(`[env] Missing ${name} — related features will fail until it's set.`);
  }
  return val;
}

module.exports = {
  GOOGLE_PLACES_API_KEY: required('GOOGLE_PLACES_API_KEY'),
  GEMINI_API_KEY: required('GEMINI_API_KEY'),
  PORT: process.env.PORT || 5000,
};