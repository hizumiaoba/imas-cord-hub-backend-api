import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      return getFunction(req, res);
    case 'POST':
      return postFunction(req, res);
    default:
      return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }
}

const getFunction = async (req: VercelRequest, res: VercelResponse) => {
  return res.status(200).json({ status: 'ok' });
}

const postFunction = async (req: VercelRequest, res: VercelResponse) => {
  if(req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ status: 'error', message: 'Content-Type must be application/json' });
  }
  return res.status(200).json({
    status: 'ok',
    message: `Hello ${req.body.name}!`
  });
}
