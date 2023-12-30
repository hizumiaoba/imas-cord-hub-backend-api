import { VercelRequest, VercelResponse } from "@vercel/node";
import { Firestore, collection, getDocs } from 'firebase/firestore/lite';
import { createAppContainer, getFirestore } from "../internal/firebaseAppFactory";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db: Firestore = getFirestore(createAppContainer());
  const servers = await getServers(db);
  return res.json(servers);
}

const getServers = async (db: Firestore): Promise<Array<any>> => {
  const serverCollection = collection(db, "servers");
  const serverSnapshot = await getDocs(serverCollection);
  const serverList = serverSnapshot.docs.map(doc => doc.data());
  return serverList;
}
