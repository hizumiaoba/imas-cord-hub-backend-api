import { VercelRequest, VercelResponse } from "@vercel/node";
import clientPromise from "../_utils/mongo";
import { createHash, randomUUID } from "crypto";
import dotenv from 'dotenv';
import { shuffleArray } from "../_utils/collections";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db("imascordhubServer");
  const collection = db.collection("serverData");
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
  const isRandom: boolean = (req.query.random as string) === "true";
  let servers = await collection.find({}).toArray()
  if (limit > 0) {
    servers = servers.slice(0, limit);
  }
  const result: Array<serverExportType> = servers.map((server) => {
    if(fields.length === 0) {
      return {
        id: server.id,
        name: server.name,
        ip: server.ip,
        waifu: server.waifu,
        description: server.description,
        invite: server.invite,
        splash: server.splash
      }
    }
    let serverFields: Partial<serverExportType> = {};
    fields.forEach((field) => {
      if (field in server) {
        serverFields[field] = server[field];
      }
    });
    return serverFields;
  });
  return res.status(200).json(isRandom ? shuffleArray(result) : result);
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
    ip: body.ip,
    waifu: body.waifu,
    description: body.description,
    invite: body.invite,
    splash: "",
    author_id: body.author_id,
    validation_token: createHash("sha256").update(valToken).digest("hex"), 
    validation_status: "pending"
  }
  const result = await collection.insertOne(docs);
  if(result.insertedId === null) {
    return res.status(500).json({ error: 'Internal Server Error', message: "Failed to write data to database" });
  }
  return res.status(202).json({
    reserved: internalId,
    validation: valToken,
    rel: {
      status: {
        url: `/servers/status`,
        method: "GET",
        hint: "Please set the header 'validation_uuid' to the value of the 'validation' field in the response of this request."
      },
      get: {
        url: `/servers/findbyid?id=${internalId}`,
        method: "GET",
        hint: "Please set the query 'id' to the value of the 'reserved' field in the response of this request. You cannot retrieve the response until the validation is completed."
      },
      delete: {
        url: `/servers/findbyid?id=${internalId}`,
        method: "DELETE",
        hint: "Please set both the query 'id' to the value of the 'reserved' field in the response of this request and the header 'validation_uuid' to the value of the 'validation' field in the response of this request. You cannot delete the response until the validation is completed."
      }
    }
  })
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
