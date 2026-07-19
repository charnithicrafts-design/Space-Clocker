import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";

export const config = {
  api: {
    bodyParser: false,
  },
};
const handler = toNodeHandler(auth);

export default async function (req: any, res: any) {
  try {
    // Vercel strips the dynamic path when rewriting to a static file endpoint.
    // We pass the dynamic part via the 'bauth' query parameter in vercel.json.
    if (req.query?.bauth) {
      // Reconstruct the full path for Better Auth
      const originalSearch = req.url?.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      const reconstructedUrl = new URL(`http://localhost/api/auth/${req.query.bauth}${originalSearch}`);
      reconstructedUrl.searchParams.delete('bauth');
      req.url = reconstructedUrl.pathname + reconstructedUrl.search;
    } else if (req.url && !req.url.startsWith("/api/auth")) {
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
