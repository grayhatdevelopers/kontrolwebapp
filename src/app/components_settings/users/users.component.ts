import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { User } from './user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FirebaseApp } from '@angular/fire';
import { FirebaseService } from 'app/shared/firebase.service';
import { isBuffer } from 'util';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
//   description: string;
// }
const EMPLOYEE_DATA: User[] = [
  {
    email:"testEmployee@kontrol.com",
    password:"abcd1234",
    displayName:"Test Employee",
    photoUrl:"../../../assets/img/faces/marc.jpg",
    role:"Employee",
    isOnline: true,
    collectedAmount:10000,
    totalAmount:20000,
    REP:"TEST",
  }, 
  {
    email:"testEmployee2@kontrol.com",
    password:"abcd12345",
    displayName:"Test Employee 2",
    photoUrl:"../../../assets/img/profilepic.jfif",
    role:"Employee",
    isOnline: true,
    collectedAmount:30000,
    totalAmount:10000,
    REP:"TEST2",
  }, 
  {
    email:"testEmployee2@kontrol.com",
    password:"abcd12345",
    displayName:"Test Employee 2",
    photoUrl:"../../../assets/img/profilepic.jfif",
    role:"Employee",
    isOnline: true,
    collectedAmount:30000,
    totalAmount:10000,
    REP:"TEST2",
  }, 
  {
    email:"testEmployee2@kontrol.com",
    password:"abcd12345",
    displayName:"Test Employee 2",
    photoUrl:"../../../assets/img/profilepic.jfif",
    role:"Employee",
    isOnline: true,
    collectedAmount:30000,
    totalAmount:10000,
    REP:"TEST2",
  }, 
  {
    email:"testEmployee2@kontrol.com",
    password:"abcd12345",
    displayName:"Test Employee 2",
    photoUrl:"../../../assets/img/profilepic.jfif",
    role:"Employee",
    isOnline: true,
    collectedAmount:30000,
    totalAmount:10000,
    REP:"TEST2",
  }, 
  {
    email:"testEmployee2@kontrol.com",
    password:"abcd12345",
    displayName:"Test Employee 2",
    photoUrl:"../../../assets/img/profilepic.jfif",
    role:"Employee",
    isOnline: true,
    collectedAmount:30000,
    totalAmount:10000,
    REP:"TEST2",
  }, 
  {
    email:'',
    password:'',
    displayName:'',
    photoUrl:'',
    role:'',
    isOnline: true,
    collectedAmount:0,
    totalAmount:0,
    REP:'',
  }, 
  // {
  //   position: 2,
  //   name: 'Helium',
  //   weight: 4.0026,
  //   symbol: 'He',
  //   description: `Helium is a chemical element with symbol He and atomic number 2. It is a
  //       colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
  //       group in the periodic table. Its boiling point is the lowest among all the elements.`
  // }, {
  //   position: 3,
  //   name: 'Lithium',
  //   weight: 6.941,
  //   symbol: 'Li',
  //   description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
  //       silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
  //       lightest solid element.`
  // }, {
  //   position: 4,
  //   name: 'Beryllium',
  //   weight: 9.0122,
  //   symbol: 'Be',
  //   description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
  //       relatively rare element in the universe, usually occurring as a product of the spallation of
  //       larger atomic nuclei that have collided with cosmic rays.`
  // }, {
  //   position: 5,
  //   name: 'Boron',
  //   weight: 10.811,
  //   symbol: 'B',
  //   description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
  //       by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
  //       low-abundance element in the Solar system and in the Earth's crust.`
  // }, {
  //   position: 6,
  //   name: 'Carbon',
  //   weight: 12.0107,
  //   symbol: 'C',
  //   description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
  //       and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
  //       to group 14 of the periodic table.`
  // }, {
  //   position: 7,
  //   name: 'Nitrogen',
  //   weight: 14.0067,
  //   symbol: 'N',
  //   description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
  //       discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
  // }, {
  //   position: 8,
  //   name: 'Oxygen',
  //   weight: 15.9994,
  //   symbol: 'O',
  //   description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
  //        the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
  //        agent that readily forms oxides with most elements as well as with other compounds.`
  // }, {
  //   position: 9,
  //   name: 'Fluorine',
  //   weight: 18.9984,
  //   symbol: 'F',
  //   description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
  //       lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
  //       conditions.`
  // }, {
  //   position: 10,
  //   name: 'Neon',
  //   weight: 20.1797,
  //   symbol: 'Ne',
  //   description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
  //       Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
  //       two-thirds the density of air.`
  // }, {
  //   position: 0,
  //   name: '',
  //   weight: 0,
  //   symbol: '',
  //   description: ``
  //     }
    
]


@Component({
  selector: 'settings-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UsersComponent 
implements OnInit 
{
  dataSource_employees=EMPLOYEE_DATA;
  // dataSource_employees = ELEMENT_DATA;
  addUserFormGroup: FormGroup;
  // secondFormGroup: FormGroup;
  columnsToDisplay = ['email', 'displayName', 'REP', 'role'];
  expandedElement: User | null;

  constructor(private formBuilder: FormBuilder,
    private firebaseService: FirebaseService
    ) { 
      this.addUserFormGroup = this.formBuilder.group({
        displayName: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
        REP: ['', Validators.required],
        photoUrl: [''],
      });
      // this.secondFormGroup = this.formBuilder.group({
      //   secondCtrl: ['', Validators.required]
      // });

    }

  ngOnInit() {

  }

  submit_newUser(){
    let newUser = new User (this.addUserFormGroup.controls['email'].value, this.addUserFormGroup.controls['password'].value, this.addUserFormGroup.controls['displayName'].value, '', "Employee", false, 0, 0, this.addUserFormGroup.controls['REP'].value);

    // newUser.displayName= this.addUserFormGroup.controls['displayName'].value;
    console.log(this.addUserFormGroup.controls['displayName'].value);
    console.log(newUser.displayName);

    // newUser.displayName=this.addUserFormGroup.controls['displayName'].value;
    // newUser.email= this.addUserFormGroup.controls['email'].value;
    // newUser.password= this.addUserFormGroup.controls['password'].value;
    // // newUser.displayName= this.addUserFormGroup.controls['displayName'].value;
    // newUser.REP= this.addUserFormGroup.controls['REP'].value;
    // newUser.
    this.firebaseService.createUser(newUser);
    // stepper.reset();

  }

}
