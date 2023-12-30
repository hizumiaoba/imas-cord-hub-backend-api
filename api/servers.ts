import { VercelRequest, VercelResponse } from "@vercel/node";
import { Firestore, collection, getDocs } from 'firebase/firestore/lite';
import { createAppContainer, getFirestore } from "./internal/firebaseAppFactory";
import { FirebaseApp } from "firebase/app";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const firebaseApp: FirebaseApp = createAppContainer();
  const db: Firestore = getFirestore(firebaseApp);
  const serverCollection = collection(db, "servers");
  const serverSnapshot = await getDocs(serverCollection);
  const servers = serverSnapshot.docs.map(doc => doc.data());
  return res.json(servers);
}
