import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../_utils/mongo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("serverData");
  const servers = await collection.find({}).toArray()
  const result: Array<serverExportType> = servers.map((server) => {
    return {
      id: server.id,
      name: server.name,
      ip: server.ip,
      waifu: server.waifu,
      description: server.description,
      invite: server.invite,
      splash: server.splash
    }
  });
  return res.status(200).json(result);
}

export type serverExportType = {
  id: string,
  name: string,
  ip: string,
  waifu: Array<String>,
  description: string,
  invite: string,
  splash: string
}
