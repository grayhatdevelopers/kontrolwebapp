import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';


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
  constructor(public db: AngularFireDatabase, 
    public notificationsService: NotificationsService,
    public store: AngularFirestore) {  
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

  getCompletedTasks() {
    return this.store.collection("paymentsRecord").valueChanges().pipe(
          // map(data=>data as any),
          tap(data => console.log('createCompletedTasks: ' + JSON.stringify(data))),
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
    return this.db.list('CHEQUES')
      .valueChanges().pipe(
        // map(data=>data as any),
        tap(data => console.log('createCheques: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getClients() {
    return this.db.object
      ('CUSTOMERS')
      .valueChanges().pipe(
        map(data => { 
          console.log("The data of customers retreived through this method...", data)
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

  getClientsData():Observable<unknown> {
    return this.db.object
      ('CUSTOMERS')
      .valueChanges().pipe(
        map(data => { 
          let clients=data;
         return clients; 
        }),
        tap(data => {
          console.log("@@",data);
          // console.log('createClients: ',(data))
        }),
        catchError(this.handleError)
      );
  }

  getClientDebit(ShopName:string): Observable<Number>{
    console.log("Entered Client Debit for", ShopName);

    return this.db.object
    ('CUSTOMERS/' + ShopName).snapshotChanges().pipe(
      map((data) => { 
       let debit=Number(data['debit']);
       return debit; 
      }),
      tap(data => {
        console.log("@@Client Data is ",data);
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

  createNewCustomer(shopName:string, company:string = '', phone:string = '', email:string = '', contactName: string = ''){
    let str = shopName;
    str = str.replace(/\s/g, '');
    var shopID:string = '';
    for (let i = 0; i < 3;i++) {
      shopID+=str[i];
    }
    var time = moment().unix();
    shopID += moment().valueOf()
    shopID+="-WEBAD";

    return this.db.database.ref('CUSTOMERS/' + shopName).set({
      ID: shopID,
      createdAt: time,
      taskNumber: 0,
      debit: 0,
      lastUpdatedAt: '',
      defaultCompany: company,
      phoneNumber: phone,
      emailAddress: email,
      contactName: contactName
    });

  }


  updateTaskVerification(taskID: string, shopName:string, paidAmount:number = 0){
    console.log("Entered Task Verification");
    // Create a reference to the cities collection
var citiesRef = this.store.firestore.collection("paymentsRecord");

// Create a query against the collection.
var query = citiesRef.where("taskNum", "==", taskID);

// var expensesCollection = this.store.firestore.collection('/paymentRecords', ref => ref.where('taskNum', '==', taskId));

var taskKey;
var sfDocRef: any;
query.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
          taskKey=doc.id;
          paidAmount = doc.data()['paidAmount'];

          sfDocRef = this.store.firestore.collection("paymentsRecord").doc(taskKey);

          this.store.firestore.runTransaction((transaction)=>{
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(sfDocRef).then((sfDoc)=>{
                if (!sfDoc.exists) {
                    throw "Document does not exist!";
                }
        
                // Add one person to the city population.
                // Note: this could be done without a transaction
                //       by updating the population using FieldValue.increment()
                var newVerified = !sfDoc.data().verified;
                transaction.update(sfDocRef, { verified: newVerified });
            });
        }).then((results) => {
            console.log("Transaction successfully committed!");


            var dataRef: any;
    dataRef = this.updateCustomerDebit(shopName, Number(paidAmount));
    dataRef.transaction( (current_value) => {
        console.log("Hopefully, the old debit is: ", current_value);
        return (current_value || 0) - paidAmount;
      }).then( (result) => {
        console.log (result);
        this.changeWaitingStatus(taskID);
        this.notificationsService.showNotification(
          1,
          "Task ID#" + taskID + " has been verified and the customer debit has been adjusted.",
          "The action has been recorded.",
          ""
        );

      
  }).catch((error)=>{
    var errorCode = error.code;
    var errorMessage = error.message;
    this.notificationsService.showNotification(4, "Encountered an error while updating Customer details, so the task was not created.", errorCode + errorMessage)
  });




            
        }).catch(function(error) {
            console.log("Transaction failed: ", error);
            this.notificationsService.showNotification(
              4,
              "Task ID#" + taskID + " could not be verified.",
              error,
              ""
            );
        });




        });
    })
    .catch(error => {
        console.log("Error getting documents: ", error);
        this.notificationsService.showNotification(
          4,
          "Error retreiving document for Task ID#" + taskID + ".",
          error,
          ""
        );
    });

  }

  changeWaitingStatus(taskID:string){
    console.log("Entered Change Waiting validation");
    

    return this.db.database.ref("TASKS/" + taskID + "/status").transaction( (current_value) => {
      console.log("Hopefully, the old Status is: ", current_value);
      return "DONE";
    }).then( (result) => {
      this.notificationsService.showNotification(
        1,
        "Task ID#" + taskID + " validated.",
        "",
        ""
      );
    }).catch(error=> {
      this.notificationsService.showNotification(
        4,
        "Could not validate cheque ID#" + taskID + ".",
        error,
        ""
      );

    });

}


  validateCheque(ChequeID:string){
      console.log("Entered Cheque validation");
      
  
      return this.db.database.ref("CHEQUES/" + ChequeID + "/validationStatus").transaction(function (current_value) {
        console.log("Hopefully, the old validationStatus is: ", current_value);
        return !current_value;
      }).then( (result) => {
        this.notificationsService.showNotification(
          1,
          "Cheque ID#" + ChequeID + " validated.",
          "",
          ""
        );
      }).catch(error=> {
        this.notificationsService.showNotification(
          4,
          "Could not validate cheque ID#" + ChequeID + ".",
          error,
          ""
        );

      });
  
  }

  updateCustomerDebit(ShopName: string, debit: number){
    console.log("Entered Update Customer Debit");
    
    //this also partially worked

    // var curdebit = firebase.database().ref('CUSTOMERS/' + ShopName).orderByChild('debit').on("child_added", function (snapshot){
    //   console.log(snapshot.key, " has ");
    //   console.log(snapshot.val(), "debit ")
    // });

    return this.db.database.ref("CUSTOMERS/" + ShopName + "/debit");
    // .transaction(function (current_value) {
    //   console.log("Hopefully, the debit is: ", current_value);
    //   return (current_value || 0) + debit;
    // });

    // this.db.database.ref().
    // ('CUSTOMERS/' + ShopName)
    // .valueChanges().pipe(
    //   map(data => { 
    //     console.log("Data for updateCustomerDebit is", data);
    //     console.log("Data['debit'] is ", data['debit']);
        
    //    olddebit=Number(data['debit']); 
    //     olddebit+=debit;

    //    this.db.database.ref('CUSTOMERS/' + ShopName).set({debit: olddebit}).then(result => {
    //     return true;
    //   })
    //   .catch(error => {
    //     this.notificationsService.showNotification(
    //       4,
    //       "Error in updating customer details:",
    //       error,
    //       ""
    //     );
    //     return false;
    //   });


    //   }),
    //   tap(data => {
    //     console.log("@@",data);
    //     console.log("Old debit is", olddebit);
    //     // console.log('createClients: ',(data))
    //   }),
    //   catchError(this.handleError)
    // );
    return false;
  }


  createNewTask(newTask: Task) {
    var newPostKey = this.db.database.ref().child('posts').push().key;
    var time= JSON.stringify(moment().unix());
    var milliseconds= JSON.stringify(moment().valueOf());
    if (newTask.num==''){
    var taskID:string  = milliseconds.substr(milliseconds.length - 5) + "-WEBAD";
    newTask.num = taskID;
  }
    var dataRef: any;
    var returnRef: any;
    dataRef = this.updateCustomerDebit(newTask.shopName, Number(newTask.debit));
    dataRef.transaction(function (current_value) {
        console.log("Hopefully, the old debit is: ", current_value);
        return (current_value || 0) + newTask.debit;
      }).then( (result) => {
        console.log (result);
      this.db.database.ref('TASKS/' + taskID).set({
      assignedTo: newTask.assignedTo,
      createdAt: time,
      date: newTask.date,   
      debit: newTask.debit,
      lastUpdatedAt: '',
      num: taskID,
      rep: newTask.rep,
      shopName: newTask.shopName,
      status: "UNDONE",
      taskModel: newTask.taskModel,
      taskType: newTask.taskType,
      transference: "1",
      company: newTask.company,
    }).then(result2 => {
      this.notificationsService.showNotification(
        2,
        "Task created!",
        "Click here to open the task in full detail.",
        "customercards"
      );
    })
    .catch(error => {
      this.notificationsService.showNotification(
        4,
        "Error in creating task:",
        error,
        ""
      );
    });
    
  }).catch((error)=>{
    var errorCode = error.code;
    var errorMessage = error.message;
    this.notificationsService.showNotification(4, "Encountered an error while updating Customer details, so the task was not created.", errorCode + errorMessage)
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
    return this.db.database.ref('TASKS/' + taskKey).remove();
  }
  

  deleteTaskRestoreDebit(taskKey:string, shopName:string, debit) {
    // this.db.database.ref().orde
    var dataRef:any;
    dataRef = this.updateCustomerDebit(shopName, Number(debit));
    dataRef.transaction(function (current_value) {
        console.log("Hopefully, the old debit is: ", current_value);
        return (current_value || 0) - debit;
      }).then( (result) => {
        console.log (result);
      
        this.db.database.ref('TASKS/' + taskKey).remove().then(result2 => {
      console.log(result2);
    })
    .catch(error => {
      this.notificationsService.showNotification(
        4,
        "Error in deleting task:",
        error,
        ""
      );
    });
    
  }).catch((error)=>{
    var errorCode = error.code;
    var errorMessage = error.message;
    this.notificationsService.showNotification(4, "Encountered an error while updating Customer details, so the task was not created.", errorCode + errorMessage)
  });

  }

  uploadProfilePicture(user:User){
  
  }

  createUser(newUser:User){
    // var newPostKey = this.db.database.ref().child('posts').push().key;

    return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password).then((result) => {
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
