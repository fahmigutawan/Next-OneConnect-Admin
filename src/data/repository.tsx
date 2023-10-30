import { initializeApp } from "firebase/app";
import { DocumentData, QuerySnapshot, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore"
import { DataSnapshot, getDatabase, onValue, ref, query as realtimeQuery, orderByChild, equalTo, update } from 'firebase/database'

export interface EmCallStruct {
  em_call_id: string,
  em_call_status_id: string,
  em_pvd_id: string,
  created_at: number,
  uid: string
}

export interface EmProviderStruct {
  em_pvd_id: string,
  name: string,
  em_type: string
}

export interface EmTypeStruct {
  em_type_id: string,
  word: string
}

export interface EmCallStatus {
  em_call_status_id: string,
  word: string
}

export interface EmTransportStruct {
  em_transport_id: string,
  em_pvd_id: string,
  is_available: boolean,
  regist_number: string
}

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

  async getAllEmProvider(
    onSuccess: (data: QuerySnapshot<DocumentData, DocumentData>) => void,
    onError: (e: Error) => void
  ) {
    await getDocs(
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

  async getEmProviderById(
    id: string,
    onSuccess: (data: EmProviderStruct) => void
  ) {
    await getDoc(
      doc(
        this.firestore,
        "em_srv_provider",
        id
      )
    ).then(s => {
      onSuccess(
        {
          em_pvd_id: s.get("em_pvd_id"),
          name: s.get("name"),
          em_type: s.get("em_type")
        }
      )
    }).catch(e => {
      console.log(e)
    })
  }

  async getEmType(
    emType: string,
    onSuccess: (data: EmTypeStruct) => void
  ) {
    await getDoc(
      doc(
        this.firestore,
        "em_type",
        emType
      )
    ).then(s => {
      console.log(s.get("em_type_id"))
      onSuccess(
        {
          em_type_id: s.get("em_type_id"),
          word: s.get("word")
        }
      )
    }).catch(e => {
      console.log(e)
    })
  }

  async getAllCallStatus(
    onSuccess: (datas: EmCallStatus[]) => void
  ) {
    getDocs(
      collection(
        this.firestore,
        "em_call_status"
      )
    ).then(s => {
      onSuccess(
        s.docs.map((item) => {
          return {
            em_call_status_id: item.get("em_call_status_id"),
            word: item.get("word")
          }
        })
      )
    }).catch(e => {
      console.log(e)
    })
  }

  changeCallStatus(
    emCallId: string,
    newStatus: string,
    onSuccess: () => void
  ) {
    update(
      ref(this.realtimeDb, `/em_call/${emCallId}`),
      {
        "em_call_status_id": newStatus
      }
    ).then(() => {
      onSuccess()
    }).catch(e => {
      console.log(e)
    })
  }

  getEmTrasportById(
    emPvdId: string,
    onSuccess: (data: EmTransportStruct[]) => void
  ) {
    getDocs(
      query(
        collection(this.firestore, "em_transport"),
        where("em_pvd_id", "==", emPvdId),
      )
    ).then(s => {
      onSuccess(
        s.docs.map(item => {
          return {
            em_pvd_id: item.get("em_pvd_id"),
            em_transport_id: item.get("em_transport_id"),
            is_available: item.get("is_available"),
            regist_number: item.get("regist_number")
          }
        })
      )
    }).catch(e => {
      console.log(e)
    })
  }

  sendNotificationToDriver() {
    //TODO
  }

  sendNotificationToUser(
    uid: string,
    title: string,
    body: string,
    onSuccess: () => void
  ) {
    getDoc(
      doc(
        this.firestore,
        "fcm_token",
        uid
      )
    ).then(fcm => {
      fetch("https://fcm.googleapis.com/fcm/send", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "key=AAAAST8F06A:APA91bEAKwQ-zPwqGGMQiK82tCwUmmTl2b0ITfdslL_D91By1qVNsu6_uB7qvQ6XPeuZvYtCW545juzB06tF7NFOE-M-MfiDcpUQTpeoFNlkG8BbqAnlnjB9H-Uo14FysEXp5_dacmIN"
        },
        body: JSON.stringify(
          {
            "to": fcm.get("token"),
            "notification": {
              "title": title,
              "body": body,
              "mutable_content": true,
              "sound": "Tri-tone"
            },

            "data": {

            }
          }
        ),
        method: "POST"
      }).then(s => {
        if (s.status == 200) {
          onSuccess()
        }
      }).catch(e => {
        console.log(e)
      })
    }).catch(e => {
      console.log(e)
    })
  }
}