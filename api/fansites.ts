import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../_utils/mongo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("fansiteData");
  const fansites = await collection.find({}).toArray()
  const result: Array<fansiteExportType> = fansites.map((fansite) => {
    return {
      id: fansite.id,
      name: fansite.name,
      waifu: fansite.waifu,
      description: fansite.description,
      link: fansite.link,
    }
  });
  return res.status(200).json(result);
}

export type fansiteExportType = {
  id: string,
  name: string,
  waifu: String,
  description: string,
  link: string,
}
