// Simple in-memory store. For production, use Redis or a DB.
const store = new Map(); // key: phone, value: { otp, expiresAt }

export function saveOTP(phone, otp, ttlMs) {
  store.set(phone, { otp, expiresAt: Date.now() + ttlMs });
}

export function getOTP(phone) {
  return store.get(phone);
}

export function deleteOTP(phone) {
  store.delete(phone);
}
