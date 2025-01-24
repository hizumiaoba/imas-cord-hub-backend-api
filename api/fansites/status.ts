import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../../_utils/mongo";
import { Db, MongoClient } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client: MongoClient = await clientPromise;
  const db: Db = client.db("imascordhubServer");
  const collection = db.collection("fansiteData");

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed', message: `Method ${req.method} is not allowed or valid.` });
  }

  const validationUuid = req.headers['validation_uuid'];
  if (!validationUuid) {
    return res.status(400).json({ error: 'Bad Request', message: 'Validation UUID is required' });
  }

  const fansite = await collection.findOne({ validation_token: validationUuid });
  if (!fansite) {
    return res.status(404).json({ error: 'Not Found', message: 'Fansite not found' });
  }

  return res.status(200).json({
    id: fansite.id,
    name: fansite.name,
    validation_status: fansite.validation_status
  });
}
