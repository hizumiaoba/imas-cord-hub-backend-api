import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../../_utils/mongo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("serverData");

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed', message: `Method ${req.method} is not allowed or valid.` });
  }

  const validationUuid = req.headers['validation_uuid'];
  if (!validationUuid) {
    return res.status(400).json({ error: 'Bad Request', message: 'Validation UUID is required' });
  }

  const server = await collection.findOne({ validation_token: validationUuid });
  if (!server) {
    return res.status(404).json({ error: 'Not Found', message: 'Server not found' });
  }

  return res.status(200).json({
    id: server.id,
    name: server.name,
    validation_status: server.validation_status
  });
}
