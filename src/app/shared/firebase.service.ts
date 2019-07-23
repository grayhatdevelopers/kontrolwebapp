import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { Cheque } from '../cheques/cheque'
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFireDatabase) {}

  getAvatars(){
      // return this.db.collection('/avatar').valueChanges()
  }

  getUser(userKey){
    // return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  updateUser(userKey, value){
    // value.nameToSearch = value.name.toLowerCase();
    // return this.db.collection('users').doc(userKey).set(value);
  }

  deleteUser(userKey){
    // return this.db.collection('users').doc(userKey).delete();
  }

  getCheques(){
    return this.db.list('Cheques')
    .valueChanges().pipe(
      // map(data=>data as any),
      tap(data => console.log('createCheques: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getClients(){
    return this.db.object
    ('Clients')
    .valueChanges().pipe(
      // map(data=>data as any),
      tap(data => console.log('createClients: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getSupplyOfficers(){
    return this.db.list('Employees')
    .valueChanges().pipe(
      // map(data=>data as any),
      tap(data => console.log('createEmployees: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  searchUsers(searchValue){
    // return this.db.collection('users',ref => ref.where('nameToSearch', '>=', searchValue)
    //   .where('nameToSearch', '<=', searchValue + '\uf8ff'))
    //   .snapshotChanges()
  }

  searchUsersByAge(value){
    // return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  }


  createUser(value, avatar){
    // return this.db.collection('users').add({
    //   name: value.name,
    //   nameToSearch: value.name.toLowerCase(),
    //   surname: value.surname,
    //   age: parseInt(value.age),
    //   avatar: avatar
    // });
  }

  private handleError(err) {
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
    console.error(err);
    return throwError(errorMessage);
  }

}
