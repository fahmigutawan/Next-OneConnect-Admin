import { initializeApp } from "firebase/app";
import { DocumentData, QuerySnapshot, collection, getDocs, getFirestore, query } from "firebase/firestore"
import { DataSnapshot, getDatabase, onValue, ref, query as realtimeQuery, orderByChild, equalTo } from 'firebase/database'

export class Repository {
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
  realtimeDb = getDatabase(this.fbApp)

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

  listenEmergencyCall(
    emPvdId: string,
    onListened: (data: DataSnapshot) => void
  ) {
    const q = realtimeQuery(
      ref(
        this.realtimeDb,
        "em_call"
      ),
      orderByChild("em_pvd_id"),
      equalTo(emPvdId)
    )

    onValue(
      q,
      (snapshot) => {
        onListened(snapshot)
      }
    )
  }
}