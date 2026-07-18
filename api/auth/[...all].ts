import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

export default function handler(req: any, res: any) {
  console.log("BETTER AUTH HIT:", req.method, req.url);
  return toNodeHandler(auth)(req, res);
}
