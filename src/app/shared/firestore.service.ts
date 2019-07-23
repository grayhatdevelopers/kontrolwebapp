import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { Cheque } from '../cheques/cheque'
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }


  //write getters and setters here
}
