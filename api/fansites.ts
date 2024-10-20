import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../_utils/mongo";
import { createHash, randomUUID } from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("fansiteData");
  switch (req.method) {
    case 'GET':
      return getFunction(req, res, collection);
    case 'POST':
      return postFunction(req, res, collection);
    default:
      return res.status(405).json({ error: 'Method Not Allowed', message: `Method ${req.method} is not allowed or valid.` });
  }
}

const getFunction = async (req: VercelRequest, res: VercelResponse, collection) => {
  const limit: number = parseInt(req.query.limit as string) || 0;
  const fields: Array<string> = (req.query.fields as string) ? (req.query.fields as string).split(",") : [];
  let fansites = await collection.find({}).toArray()
  if(limit > 0) {
    fansites = fansites.slice(0, limit);
  }
  const result: Array<fansiteExportType> = fansites.map((fansite) => {
    if(fields.length === 0) {
      return {
        id: fansite.id,
        name: fansite.name,
        waifu: fansite.waifu,
        description: fansite.description,
        link: fansite.link
      }
    }
    let fansiteFields: Partial<fansiteExportType> = {};
    fields.forEach((field) => {
      if(field in fansite) {
        fansiteFields[field] = fansite[field];
      }
    });
    return fansiteFields;
  });
  return res.status(200).json(result);
}

const postFunction = async (req: VercelRequest, res: VercelResponse, collection) => {
  if(req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }
  if(!req.body) {
    return res.status(400).json({ error: 'You must provide a body' });
  }
  if(req.headers['x-admin-token'] !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Currently this API is only available for the administrator."
    })
  }
  const body = req.body;
  const valToken = randomUUID();
  const internalId = randomUUID();
  const docs = {
    id: internalId,
    name: body.name,
    waifu: body.waifu,
    description: body.description,
    link: body.link,
    author_id: body.author_id,
    validation_token: createHash('sha256').update(valToken).digest('hex'),
    validation_status: "pending"
  }
  await collection.insertOne(docs);
  return res.status(200).json({
    reserved: internalId,
    validation: valToken,
    rel: {
      status: {
        url: "/fansites/status",
        method: "GET",
        hint: "Please set the header 'validation_uuid' to the value of 'validation' in the response of this request."
      },
      get: {
        url: `/fansites/findbyid?id=${internalId}`,
        method: "GET",
        hint: "Please set the query 'id' to the value of 'reserved' in the response of this request. You cannot retrieve the data until the validation is completed."
      },
      delete: {
        url: `/fansites/findbyid?id=${internalId}`,
        method: "DELETE",
        hint: "Please set both the header 'validation_uuid' and the query 'id' to the value of 'validation' and 'reserved' in the response of this request. You cannot delete the data until the validation is completed."
      }
    }
  });
}

export type fansiteExportType = {
  id: string,
  name: string,
  waifu: String,
  description: string,
  link: string,
}
