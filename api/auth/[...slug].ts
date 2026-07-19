import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

export const config = {
  api: {
    bodyParser: false,
  },
};
const handler = toNodeHandler(auth);

export default async function (req: any, res: any) {
  try {
    if (req.url && !req.url.startsWith("/api/auth")) {
      req.url = "/api/auth" + (req.url.startsWith("/") ? "" : "/") + req.url;
    }
    
    // Force HTTPS protocol for trustedOrigins matching
    req.headers["x-forwarded-proto"] = "https";
    
    // Pass the request to Better Auth
    await handler(req, res);
  } catch (err) {
    console.error("Auth handler error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error in Auth Handler");
  }
}
