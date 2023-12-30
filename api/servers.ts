import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../_utils/mongo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("serverData");
  const servers = await collection.find({}).toArray()
  return res.status(200).json(servers);
}
