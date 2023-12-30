import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../../_utils/mongo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("fansiteData");
  const exactFansite = await collection.findOne({ id: req.query.id});
  if (!exactFansite) return res.status(404).json({ message: "Not Found" });

  return res.status(200).json({
    id: exactFansite.id,
    name: exactFansite.name,
    waifu: exactFansite.waifu,
    description: exactFansite.description,
    link: exactFansite.link,
  });
}

