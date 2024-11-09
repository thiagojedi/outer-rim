import { Buffer } from "node:buffer";
import { randomBytes } from "node:crypto";

const base64URLEncode = (str: Buffer) =>
  str.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

export const generateRandomId = () => base64URLEncode(randomBytes(32));
