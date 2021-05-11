import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { ResultStatut } from './resultstatut';
import {FireBaseConstant } from "./firebase-constant"

@Injectable({
  providedIn: 'root'
})
export class FirebaseApi {

  static firebaseConfig:any = {
    apiKey: "AIzaSyCIi9bNVRxjBxEF5FgUsJwivy1bGH34EzY",
    authDomain: "momo-coin-23837.firebaseapp.com",
    databaseURL: "https://momo-coin-23837-default-rtdb.firebaseio.com",
    projectId: "momo-coin-23837",
    storageBucket: "momo-coin-23837.appspot.com",
    messagingSenderId: "155737173284",
    appId: "1:155737173284:web:07f41f5db9527097d017b1",
    measurementId: "G-KPM5Z0YSG1"

  };
  debug:boolean=false;
  offlineMode:boolean=false;
  db:any;

  constructor() {

    // Initialize Firebase
    firebase.initializeApp(FirebaseApi.firebaseConfig);
    //firebase.analytics();
    this.db=firebase.database();
    this.setDebugMode();
    this.setModeApp();
  }
  setDebugMode()
  {
    // if(this.debug) firebase.firestore.setLogLevel('debug');

  }
  setModeApp()
  {
    // if(this.offlineMode) firebase.firestore().enablePersistence();
  }
  getFirebaseDatabase()
  {
    return this.db;
  }
  add(url:string,value:any):Promise<ResultStatut>
  {
    let action=new ResultStatut();
    return new Promise((resolve, reject)=>{
      this.db.ref(url).push().set(value).then((doc)=>{
        action.description="successful add new collection";
        resolve(action);
      }).catch((err)=>{
        action.apiCode=err.code;
        action.code=ResultStatut.UNKNOW_ERROR;
        action.message="error";
        action.description="Description of error: "+err;
        reject(action);
      });
    });
  }
  set(url:string,value:any):Promise<ResultStatut>
  {
    let action=new ResultStatut();
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.db.ref(url).set(value).then(()=>{
        action.message="success";
        action.description="successful set new collection";
        resolve(action);
      }).catch((err)=>{
        action.apiCode=err.code;
        action.code=ResultStatut.UNKNOW_ERROR;
        action.message="error";
        action.description="Description of error: "+err;
        reject(action)
      });
    })
  }
  fetchOnce(url:string):Promise<ResultStatut>
  {
    let action=new ResultStatut();
    return new Promise((resolve,reject)=>{
      this.db.ref(url).once('value')
      .then( (doc)=>{
        try
        {
          action.result=doc.val();
          action.description="Successful fetching information";
          resolve(action);
        }
        catch (err) {
          action.apiCode=err.code;
          action.code=ResultStatut.UNKNOW_ERROR;
          action.message="error";
          action.description=`Description of error: ${err}`;
          reject(action);
        }
      })
    });
  }


  fetch(url:string):Promise<ResultStatut>
  {
    let action=new ResultStatut();
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.db.ref(url).on('value', (doc)=>{
        try
        {
          // let r=[];
          // doc.forEach(element => {
          //   r.push(element.val());
          // });
          action.description="Successful fetching information";
          action.result=doc.val();
          resolve(action);
        }
        catch (err) {
          action.apiCode=err.code;
          action.code=ResultStatut.UNKNOW_ERROR;
          action.message="error";
          action.description=`Description of error: ${err}`;
          reject(action);
        }
      });
    });
  }

  update(url:string,updates:any):Promise<ResultStatut>
  {
    let action=new ResultStatut();
    return new Promise<ResultStatut>((resolve,reject)=>{
      try
      {
        this.db.ref(url).update(updates);
        action.description="Successful update information";
        resolve(action);
      }
      catch(err)
      {
        action.apiCode=err.code;
        action.code=ResultStatut.UNKNOW_ERROR;
        action.message="error";
        action.description=`Description of error: ${err}`;
        reject(action);
      }
    });
  }
  updates(updates:{link:String,data:any}[]):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      let up={};
      let result=new ResultStatut();
      updates.forEach((update)=>up[update.link.toString()]=update.data);
      this.db.ref().update(up,(error)=>{
        if(error) 
        {
          result.apiCode=error.error;
          result.message=error.message;
          return reject(result);
        }
        resolve(result);
      })
    })
    
  }
  delete(url:string):Promise<ResultStatut>
  {
    let action=new ResultStatut();
    return new Promise<ResultStatut>((resolve,reject)=>{
      try
      {
        this.db.ref(url).remove();
        action.description="Successful deleting information";
        resolve(action);
      }
      catch(err)
      {
        action.apiCode=err.code;
        action.code=ResultStatut.UNKNOW_ERROR;
        action.message="error";
        action.description=`Description of error: ${err}`;
        reject(action);
      }
    });

  }
  get user()
  {
    return firebase.auth().currentUser;
  }

  signInApi(email:string,password:string): Promise<ResultStatut>
  {
    let result:ResultStatut=new ResultStatut();
    return new Promise(async (resolve,reject)=>{
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then((userCredential)=>{
          result.description="Authentification successful";
          result.result=userCredential;
          resolve(result);
        })
        .catch((error)=>
        {
          result.code=ResultStatut.UNKNOW_ERROR;
          result.apiCode=error.code;
          result.message="error";
          result.description=`Description of error: ${error}`;
          reject(result);
        })
    });
  }
  signOutApi()
  {
    firebase.auth().signOut();
  }
  createUserApi(email:string,password:string):Promise<ResultStatut>
  {
    let result:ResultStatut=new ResultStatut();
    return new Promise( async (resolve,reject)=>{
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then((userCredential)=>{
          result.description="Account was created successful";
          result.result=userCredential;
          resolve(result);
        })
        .catch( (error)=>{
          result.code=ResultStatut.UNKNOW_ERROR;
          result.apiCode=error.code;
          result.message=`error: ${error.code}`;
          result.description=`Description of error: ${error.message}`;
        reject(result);
      });
    });
  }
  handleConnexionState(callBack)
  {
    firebase.database().ref('./info/connected').on("value",(snap)=>{
      if(snap.val() === true) callBack({connected:true});
      else callBack({connected:false});
    })
  }
  handleApiError(result:ResultStatut)
  {
    switch(result.apiCode)
    {
      case FireBaseConstant.AUTH_WRONG_PASSWORD:
        result.message="Email ou mot de passe incorrect";
        break;
      case FireBaseConstant.AUTH_WEAK_PASSWORD:
        result.message="Mot de passe doit avoir au moins 6 carracteres"
        break;
      case FireBaseConstant.AUTH_EMAIL_ALREADY_USE:
        result.message="Email déjà utiliser par un autre utilisateur";
        break;
      case FireBaseConstant.NET_NETWORK_FAIL:
        result.message="Hors connexion. Veuillez verifier votre connectivité réseau";
        break;
    };
  }
}
