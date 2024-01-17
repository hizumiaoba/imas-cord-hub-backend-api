import { VercelRequest, VercelResponse } from '@vercel/node';

export async function GET(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ status: 'ok' });
}

export async function POST(req: VercelRequest, res: VercelResponse) {
  if(req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'invalid content type of body.'})
  }
  const body = req.body;
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    message: `Hello ${body.name}!`
  });
}
