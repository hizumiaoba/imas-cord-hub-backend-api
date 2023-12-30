import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../../_utils/mongo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("serverData");
  const exactServer = await collection.findOne({ id: req.query.id});
  if (!exactServer) return res.status(404).json({ message: "Not Found" });

  return res.status(200).json({
    id: exactServer.id,
    name: exactServer.name,
    ip: exactServer.ip,
    waifu: exactServer.waifu,
    description: exactServer.description,
    invite: exactServer.invite,
    splash: exactServer.splash
  });
}
