import { FirebaseApp } from "firebase/app";
import { createAppContainer } from "../internal/firebaseAppFactory";
import { getFirestore, collection, getDocs, Firestore, DocumentData } from "firebase/firestore/lite";

const firebaseApp: FirebaseApp = createAppContainer();
const db: Firestore = getFirestore(firebaseApp);

const getServers = async (db: Firestore): Promise<Array<DocumentData>> => {
  const serverCollection = collection(db, "servers");
  const serverSnapshot = await getDocs(serverCollection);
  const serverList = serverSnapshot.docs.map(doc => doc.data());
  return serverList;
}

const main = async () => {
  const servers: Array<DocumentData> = await getServers(db);
  console.log(servers[0]);
}

main();
