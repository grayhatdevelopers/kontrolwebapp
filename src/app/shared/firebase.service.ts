import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';


import { Cheque } from '../cheques/cheque'
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Task } from '../tasks/task'
import { NotificationsService } from './notifications-service.service';
import * as firebase from 'firebase';
import { UrlTree } from '@angular/router';
import { Profile } from 'selenium-webdriver/firefox';
import { User } from 'app/components_settings/users/user';
import * as moment from 'moment';

export class UserProfile{
  // displayName:string;
  // photoUrl:string;
  constructor (
    public displayName= "",
    public photoUrl= ""
  ){}
  // test:string;
}

@Injectable(
  {
  providedIn: 'root'
  }
)
export class FirebaseService {
  constructor(public db: AngularFireDatabase, public notificationsService: NotificationsService) {  
  }

  getAvatars() {
    // return this.db.collection('/avatar').valueChanges()
  }


  getActiveTasks() {
    return this.db.list
  ("TASKS").valueChanges().pipe(
        // map(data=>data as any),
        tap(data => console.log('createTasks: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }


  getUser(userKey) {
    // return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  updateUser(userKey, value) {
    value.nameToSearch = value.name.toLowerCase();
    return this.db.list('Tasks').update;
  }



  getCheques() {
    return this.db.list('Cheques')
      .valueChanges().pipe(
        // map(data=>data as any),
        tap(data => console.log('createCheques: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getClients() {
    return this.db.object
      ('Clients')
      .valueChanges().pipe(
        map(data => { 
         let clients=Object.keys(data);
         return clients; 
        }),
        tap(data => {
          console.log("@@",data);
          // console.log('createClients: ',(data))
        }),
        catchError(this.handleError)
      );
  }

  getEmployees() {
    return this.db.list('Employees')
      .valueChanges().pipe(
        // map(data=>data as any),
        tap(data => console.log('createEmployees: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateTask(taskRef: Task) {
    // this.studentRef.update({
  //     firstName: student.firstName,
  //     lastName: student.lastName,
  //     email: student.email,
  //     mobileNumber: student.mobileNumber
  //   })
  
  }  

  getUsers(){
  //  firebase.auth(). 
  }

  searchUsers(searchValue) {
    // return this.db.collection('users',ref => ref.where('nameToSearch', '>=', searchValue)
    //   .where('nameToSearch', '<=', searchValue + '\uf8ff'))
    //   .snapshotChanges()
  }

  searchUsersByAge(value) {
    // return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  }

  createNewTask(newTask: Task) {
    var newPostKey = this.db.database.ref().child('posts').push().key;

    return this.db.database.ref('TASKS/' + newPostKey).set({
      assignedTo: newTask.assignedTo,
      createdAt: moment().unix(),
      date: newTask.date,   
      debit: newTask.debit,
      lastUpdatedAt: '',
      num: newTask.num,
      rep: newTask.rep,
      shopName: newTask.shopName,
      status: "UNDONE",
      taskModel: newTask.taskModel,
      taskType: newTask.taskType,
      transference: "1",
      company: newTask.company,
    });

    
    // .then(function(){
    //  alert("Task created successfully.");
    //     // this.notificationsService.showNotification(0, "Error", "hello", "");
    // }).catch(function(error) {
    //   alert("Task was not created." + error);
    //     // this.notificationsService.showNotification(3, "Error in creating task:", error, '');

    // });
  }

  deleteTask(taskKey) {
    // this.db.database.ref().orde
    return this.db.database.ref('TASKS/' + taskKey).remove;
  }



  createUser(newUser:User){
    // var newPostKey = this.db.database.ref().child('posts').push().key;

    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password).then((result) => {
      // firebase.auth().
      let extraInfo = new UserProfile (newUser.displayName, newUser.photoUrl);
      // photoUrl="https://images3.memedroid.com/images/UPLOADED504/5ce445b0138c8.jpeg";
      // extraInfo["displayName"]=newUser.displayName;
      // extraInfo.photoUrl=newUser.photoUrl;
      // extraInfo.test="Hello World";
      //toDo: Check whether this test actually gets uploaded and results in normal user functionality. Could store Role, isOnline, CollectedAmount, TotalCollectedAmount, REPName
      result.user.updateProfile(extraInfo);
      this.db.database.ref('Employees/' + newUser.displayName).set({
        REP: newUser.REP, 
        collectedCash: 0, 
        completedTasks: 0,
        isOnline: false,
      }).then().catch((error) =>{
        var errorCode = error.code;
        var errorMessage = error.message;
        this.notificationsService.showNotification(4, "Encountered an error while updating user details.", errorCode + errorMessage)
  
      });
      this.notificationsService.showNotification(2, "User created successfully.", "Click here to open the User's info page.", "")

      // result.user.
    }).catch((error)=> {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      this.notificationsService.showNotification(4, "Encountered an error while creating user.", errorCode + errorMessage)
      // ...
    });

    // firebase.auth().createUser({
    //   email: <UserEmail>,
    //   password: <UserPass>
    // }).then(
    //   (success) => {
    //   success.auth.updateProfile({
    //       displayName: <UserName>,
    //       photoURL: <UserPhotoURLString>
    //     })
    //     .then(res => console.log("profile updated"))
    //     .catch(err => console.log(err));
    // }).catch(
    //   (err) => {
    //   console.log(err);
    // })
  }


  signIn(email:string ,password:string ){
    return firebase.auth().signInWithEmailAndPassword(email,password);
    // return this.db.database.app.auth().signInWithEmailAndPassword(email, password);
    // this.fireboi
    
  }

  signOut(){
    return firebase.auth().signOut();
  }

  isLoggedIn():Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let returnTo:any;
    console.log( "Current User:", firebase.auth().currentUser);
    if (firebase.auth().currentUser){
      return true;      
    }
    else{
      return false;
    }


    }
    
    
  getCurrentUser():any{
      return firebase.auth().currentUser;
    // .onAuthStateChanged
    // ((user) => {
    //   // returnTo=user;
    //   if (user) {
    //     returnTo=true;// User is signed in.
    //     // this.returnTo=true;
    //     var displayName = user.displayName;
    //     var email = user.email;
    //     var emailVerified = user.emailVerified;
    //     var photoURL = user.photoURL;
    //     var isAnonymous = user.isAnonymous;
    //     var uid = user.uid;
    //     var providerData = user.providerData;
    //     // ...
    //   } else {
    //     // User is signed out.
    //     returnTo= false;
    //     // ...
    //   }
    // });
    // return returnTo;
  }

  handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client- side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.log("Hello Error", err);
    this.notificationsService.showNotification(3, "Error in communicating with web server:", err, '');
    return throwError(errorMessage);
  }

}
