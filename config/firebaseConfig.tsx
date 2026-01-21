import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu nueva configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC47IepkwGTuEMc6IO_R7R-229H9i63zLk",
  authDomain: "complesivo-753eb.firebaseapp.com",
  databaseURL: "https://complesivo-753eb-default-rtdb.firebaseio.com",
  projectId: "complesivo-753eb",
  storageBucket: "complesivo-753eb.firebasestorage.app",
  messagingSenderId: "553031958857",
  appId: "1:553031958857:web:3ece0303732c988a181a98"
};

// 1. Inicializar la aplicación
const app = initializeApp(firebaseConfig);

// 2. Exportar los servicios para usarlos en Login y Registro
export const auth = getAuth(app);
export const db = getFirestore(app);