import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// CAMBIO: Importamos Realtime Database en lugar de Firestore
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
  apiKey: "AIzaSyC47IepkwGTuEMc6IO_R7R-229H9i63zLk",
  authDomain: "complesivo-753eb.firebaseapp.com",
  // Esta URL es vital para que funcione Realtime Database
  databaseURL: "https://complesivo-753eb-default-rtdb.firebaseio.com",
  projectId: "complesivo-753eb",
  storageBucket: "complesivo-753eb.firebasestorage.app",
  messagingSenderId: "553031958857",
  appId: "1:553031958857:web:3ece0303732c988a181a98"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// CAMBIO: Exportamos la instancia de "database" (Realtime)
export const db = getDatabase(app);