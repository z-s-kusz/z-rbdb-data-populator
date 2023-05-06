import { initializeApp } from "firebase/app";
import { getFirestore, writeBatch, doc, collection } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later
const firebaseConfig = {
// key and config ok to share publicly
  apiKey: "AIzaSyBeY5-OKSUbeCYXfaJkvbY-M707qP2LAAU",
  authDomain: "zrbdb-9001f.firebaseapp.com",
  projectId: "zrbdb-9001f",
  storageBucket: "zrbdb-9001f.appspot.com",
  messagingSenderId: "1020046397159",
  appId: "1:1020046397159:web:1de748af9082403cb5dc42",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export function bulkAddData(songs, urlUsed) {
    console.log('starting write for ' + urlUsed);
    const batch = writeBatch(db);

    songs.forEach((song) => {
        const newDocRef = doc(collection(db, 'songs'));
        batch.set(newDocRef, song);
    });

    batch.commit()
        .then((response) => {
            console.log('success! for ' + urlUsed);
        })
        .catch((error) => {
            console.error('error in batch upload', error);
            console.error('in ' + urlUsed);
        });
}
