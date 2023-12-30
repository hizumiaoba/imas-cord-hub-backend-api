import { VercelRequest, VercelResponse } from "@vercel/node";
import { Firestore, collection, getDocs } from 'firebase/firestore/lite';
import { createAppContainer, getFirestore } from "../internal/firebaseAppFactory";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db: Firestore = getFirestore(createAppContainer());
  const snapshot = await getDocs(collection(db, "servers"));
  const serverList = snapshot.docs.map(doc => doc.data());
  return res.json(serverList);
}
