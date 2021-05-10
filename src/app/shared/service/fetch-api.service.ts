import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import * as firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";
import * as firebase from 'firebase';
import { User } from '../model/user';
import { ActionStatut } from '../model/statut';
@Injectable({
  providedIn: 'root'
})
export class FetchApiService {

  firebaseConfig = {
    apiKey: "AIzaSyC35t8gc8Q0xY9OLJ8Nlqj-Yok7mdZ5UYA",
    authDomain: "oyasie-49ca7.firebaseapp.com",
    databaseURL: "https://oyasie-49ca7.firebaseio.com",
    projectId: "oyasie-49ca7",
    storageBucket: "oyasie-49ca7.appspot.com",
    messagingSenderId: "915231080440",
    appId: "1:915231080440:web:55a3fb7765e6eadb60200d",
    measurementId: "G-FR2N44PFSR"
  };
  debug:boolean=false;
  offlineMode:boolean=false;
  db:any;

  constructor(private httpClient:HttpClient) { 
    
    // Initialize Firebase
    firebase.initializeApp(this.firebaseConfig);
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
  add(url:string,value:any):Promise<ActionStatut>
  {
    let action=new ActionStatut();
    return new Promise((resolve, reject)=>{
      this.db.ref(url).push().set(value).then((doc)=>{
        action.description="successful add new collection";
        resolve(action);
      }).catch((err)=>{
        action.apiCode=err.code;
        action.code=ActionStatut.UNKNOW_ERROR;
        action.message="error";
        action.description="Description of error: "+err;
        reject(action);
      });
    });
  }
  set(url:string,value:any):Promise<ActionStatut>
  {
    
    let action=new ActionStatut();
    return new Promise<ActionStatut>((resolve,reject)=>{
      this.db.ref(url).set(value).then(()=>{
        action.message="success";
        action.description="successful set new collection";
        resolve(action);
      }).catch((err)=>{
        action.apiCode=err.code;
        action.code=ActionStatut.UNKNOW_ERROR;
        action.message="error";
        action.description="Description of error: "+err;
        reject(action)
      });
    })
  }
  fetchOnce(url:string):Promise<ActionStatut>
  {
    let action=new ActionStatut();
    return new Promise((resolve,reject)=>{
      this.db.ref(url).once('value')
      .then( (doc)=>{
        try
        {
          console.log(doc);
          action.result={};
          doc.forEach(element => {
            // console.log("element ",element," key ",element.key);
            action.result[element.key]=element.val();
          });
          action.description="Successful fetching information";
          resolve(action);
        }
        catch (err) {
          action.apiCode=err.code;
          action.code=ActionStatut.UNKNOW_ERROR;
          action.message="error";
          action.description=`Description of error: ${err}`;
          reject(action);
        }
      })
    });
  }
  
  
  fetch(url:string):Promise<ActionStatut>
  {
    console.log("fetch")
    let action=new ActionStatut();
    return new Promise<ActionStatut>((resolve,reject)=>{
      this.db.ref(url).on('value', (doc)=>{
        try
        {
          console.log("fetch",doc);
          let r=[];
          doc.forEach(element => {
            r.push(element.val());
          });
          action.description="Successful fetching information";
          action.result=r;
          resolve(action);
        }
        catch (err) {
          action.apiCode=err.code;
          action.code=ActionStatut.UNKNOW_ERROR;
          action.message="error";
          action.description=`Description of error: ${err}`;
          reject(action);
        }
      });
    });
  }
  
  update(url:string,updates:any):any
  {
    this.db.ref(url).update(updates)
  }
  delete(url:string)
  {
    this.db.ref(url).remove();
  }
  get user()
  {
    return firebase.auth().currentUser;
  }

  signInApi(email:string,password:string): Promise<ActionStatut>
  {
    let result:ActionStatut=new ActionStatut();
    return new Promise(async (resolve,reject)=>{
      try
      {
        await firebase.auth().signInWithEmailAndPassword(email,password);
        result.description="Authentification successful";
        resolve(result);
      } catch(error)
      {
        result.code=ActionStatut.UNKNOW_ERROR;
        result.apiCode=error.code;
        result.message="error";
        result.description=`Description of error: ${error}`;
        reject(result);
      }
    });
  }
  signOutApi()
  { 
    firebase.auth().signOut();
  } 
  createUserApi(email:string,password:string):Promise<ActionStatut>
  {
    let result:ActionStatut=new ActionStatut();
    return new Promise( async (resolve,reject)=>{
      try
      {
        await  firebase.auth().createUserWithEmailAndPassword(email,password);
        result.description="Account was created successful";
        resolve(result);
      }
      catch(error) {
        result.code=ActionStatut.UNKNOW_ERROR;
        result.apiCode=error.code;
        result.message=`error: ${error.code}`;
        result.description=`Description of error: ${error.message}`;
        reject(result);
      }
      
    });
  }
}
