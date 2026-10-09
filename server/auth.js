import crypto from "node:crypto";
import { HttpError } from "./errors.js";

const users = new Map(); // email -> user
const sessions = new Map(); // token -> user

const hash = (password, salt) => crypto.scryptSync(password, salt, 32).toString("hex");
const publicUser = ({ id, name, email }) => ({ id, name, email });

function startSession(user) {
  const token = crypto.randomUUID();
  sessions.set(token, user);
  return { token, user: publicUser(user) };
}

export function register({ name, email, password } = {}) {
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email ?? "") || (password ?? "").length < 8) {
    throw new HttpError(400, "Enter your name, a valid email and a password of at least 8 characters.");
  }
  const key = email.toLowerCase();
  if (users.has(key)) throw new HttpError(409, "An account with this email already exists.");
  const salt = crypto.randomBytes(16).toString("hex");
  const user = { id: crypto.randomUUID(), name: name.trim(), email: key, salt, passwordHash: hash(password, salt) };
  users.set(key, user);
  return startSession(user);
}

export function login({ email, password } = {}) {
  const user = users.get((email ?? "").toLowerCase());
  const ok =
    user &&
    crypto.timingSafeEqual(Buffer.from(hash(password ?? "", user.salt)), Buffer.from(user.passwordHash));
  if (!ok) throw new HttpError(401, "Email or password is incorrect.");
  return startSession(user);
}

export const userForToken = (token) => (token ? sessions.get(token) ?? null : null);
export const endSession = (token) => sessions.delete(token);
