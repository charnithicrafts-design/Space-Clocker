import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

export default toNodeHandler(auth);
