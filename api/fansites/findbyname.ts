import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../../_utils/mongo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("fansiteData");
  const searchQuery = {
    name: {
      "$regex": req.query.name,
    }
  }
  const fansites = await collection.find(searchQuery).toArray();
  if(fansites.length === 0) return res.status(404).json({
    message: `The fansite that matches ${req.query.name} was not found.`,
    hint: "URL encoing may be recommended. This will search with partial match."
  });

  const result = fansites.map(fansite => {
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
