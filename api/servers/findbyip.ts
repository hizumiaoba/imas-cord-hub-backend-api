import clientPromise from '../../_utils/mongo';
import { VercelRequest, VercelResponse } from '@vercel/node';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db('imascordhubServer');
  const collection = db.collection('serverData');
  const searchQuery = {
    ip: req.query.ip
  };
  const servers = await collection.find(searchQuery).toArray();
  if(servers.length === 0) {
    res.status(404).send('The server with the given IP was not registered yet.');
    return;
  }
  const result = servers.map((server) => {
    return {
      id: server.id,
      name: server.name,
      ip: server.ip,
      waifu: server.waifu,
      description: server.description,
      invite: server.invite,
      splash: server.splash,
    };
  });
  return res.status(200).json(result);
}
