import { Component, OnInit } from '@angular/core';
// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter} from '@angular/material/core';
import {NotificationsService} from '../shared/notifications-service.service';
import {PopupService} from '../shared/popup-service.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';



import {map, startWith} from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { FirebaseService } from '../shared/firebase.service'

import { Client } from '../customercards/client'
import { SupplyOfficer } from '../table-list/supplyofficer'
// import { NotificationsComponent } from '../notifications/notifications.component'
// export interface Food {
//   value: string;
//   viewValue: string;
// }

@Component({
  selector: 'p-tasks',
  templateUrl: './tasks-panel.component.html',
  styleUrls: ['./tasks-panel.component.css']
})




export class TasksPanelComponent implements OnInit {
  company_new:string="Select Company";
  date_new:string="";
  clientData:Client [];
  clientOptions_new: Observable<string[]>;
  selectedSupplyOfficer: SupplyOfficer;
  supplyOfficerList: SupplyOfficer [];



  // foods: Food[] = [
  //   {value: 'steak', viewValue: 'Steak'},
  //   {value: 'pizza-1', viewValue: 'Pizza'},
  //   {value: 'tacos-2', viewValue: 'Tacos'}
  // ];
  // heroForm:any;
  company:string="Select Company";
  constructor(private _adapter: DateAdapter<any>, private notificationsService: NotificationsService, public dialog: MatDialog, private formBuilder: FormBuilder, private firebaseService: FirebaseService) {}

  newtaskForm: FormGroup;
  isSubmitted  =  false;

  openDialog(header_new:string, body_new:string, footer_new:string, returnTo_new:string): void {
    const dialogRef = this.dialog.open(PopupService, {
      width: '500px',
      data: {header: header_new, body: body_new}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed, ${result}`);
        if (result){
          this.notificationsService.showNotification(2, 'Task created!', 'Click here to open the task in full detail.', 'customercards');
        }

    });
  }


  // french() {
  //   this._adapter.setLocale('fr');
  // }

  ngOnInit() {
  
    this.firebaseService.getClients()
    .subscribe((result:any) => {
      this.clientData = result;
      console.log(`Got Clients: ${this.clientData}`);
    })


    this.newtaskForm  =  this.formBuilder.group({
      company_new: ['', Validators.required],
      date_new: ['', Validators.required]
  });

  this.firebaseService.getSupplyOfficers()
  .subscribe((result:any) => {
    this.supplyOfficerList = result;
    console.log(`Got Clients: ${this.supplyOfficerList}`);
  })
    
  // this.clientOptions_new = this.newtaskForm.valueChanges
  // .pipe(
  //   startWith(''),
  //   map(value => this._filter(value))
  // );
  
    // this.notificationsService.showNotification(1, 'hello world!');

    // this.heroForm = new FormGroup({
    //   'name': new FormControl(this.hero.name, [
    //     Validators.required,
    //     Validators.minLength(4),
    //     forbiddenNameValidator(/bob/i) // <-- Here's how you pass in the custom validator.
    //   ]),
    //   'alterEgo': new FormControl(this.hero.alterEgo),
    //   'power': new FormControl(this.hero.power, Validators.required)
    // });

  }

  tempClients : any [];
  private _filter(value: string): Client[] {
    const filterValue = value.toLowerCase();
    // for (let i=0; i<10; i++)
    return this.clientData.filter(option => option);
  }
}