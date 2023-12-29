import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({
    message: "This is the /servers/inside endpoint!"
  });
}
