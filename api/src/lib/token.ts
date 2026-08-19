import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateUserToken = (id: number, username: string) => {
  return jwt.sign({id,username},env.userSecret);
}

export const generateAdminToken = (id: number, username: string) => {
  return jwt.sign({id,username},env.adminSecret);
}