import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../../_utils/mongo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("serverData");
  const searchQuery = {
    name: {
      "$regex": req.query.name,
    }
  }
  const servers = await collection.find(searchQuery).toArray();
  if(servers.length === 0) return res.status(404).json({
    message: `The server that matches ${req.query.name} was not found.`,
    hint: "Try with another name, or more non-specific name."
  });
}
