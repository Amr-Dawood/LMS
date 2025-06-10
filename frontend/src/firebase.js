import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC0V-kpn2Pz1j_f0QNE6k9q89zFY_8rJgQ",
    authDomain: "lmsweb-aa16e.firebaseapp.com",
    projectId: "lmsweb-aa16e",
    storageBucket: "lmsweb-aa16e.firebasestorage.app",
    messagingSenderId: "359159655691",
    appId: "1:359159655691:web:b52f6eebd0c08457fc060e",
    measurementId: "G-V578KVE6XN"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };