import { initializeApp } from "firebase/app";
import { DocumentData, QuerySnapshot, collection, getDocs, getFirestore, query } from "firebase/firestore"

class Repository {
  firebaseConfig = {
    apiKey: process.env.FB_APIKEY,
    authDomain: process.env.FB_AUTHDOMAIN,
    databaseURL: process.env.FB_DATABASEURL,
    projectId: process.env.FB_PROJECTID,
    storageBucket: process.env.FB_STORAGEBUCKET,
    messagingSenderId: process.env.FB_MESSAGINGSENDERID,
    appId: process.env.FB_APPID
  };
  fbApp = initializeApp(this.firebaseConfig);
  firestore = getFirestore(this.fbApp)

  getAllEmProvider(
    onSuccess: (data: QuerySnapshot<DocumentData, DocumentData>) => void,
    onError: (e: Error) => void
  ) {
    getDocs(
      query(
        collection(
          this.firestore,
          "em_srv_provider"
        )
      )
    ).then(value => {
      onSuccess(value)
    }).catch((e: Error) => {
      onError(e)
    })
  }
}