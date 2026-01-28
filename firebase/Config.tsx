import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC47IepkwGTuEMc6IO_R7R-229H9i63zLk",
  authDomain: "complesivo-753eb.firebaseapp.com",
  databaseURL: "https://complesivo-753eb-default-rtdb.firebaseio.com",
  projectId: "complesivo-753eb",
  storageBucket: "complesivo-753eb.firebasestorage.app",
  messagingSenderId: "553031958857",
  appId: "1:553031958857:web:3ece0303732c988a181a98"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);