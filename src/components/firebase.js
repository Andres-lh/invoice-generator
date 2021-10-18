import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const app = initializeApp({
    apiKey: "AIzaSyB4Rolgfrn5vr2X3YSg6gW96WGB2sD23SE",
    authDomain: "invoice-generator-d07e2.firebaseapp.com",
    databaseURL: "https://invoice-generator-d07e2-default-rtdb.firebaseio.com",
    projectId: "invoice-generator-d07e2",
    storageBucket: "invoice-generator-d07e2.appspot.com",
    messagingSenderId: "1092730237834",
    appId: "1:1092730237834:web:4629c6b870060770e3ce73"
})

export const firestore = getFirestore(app);
