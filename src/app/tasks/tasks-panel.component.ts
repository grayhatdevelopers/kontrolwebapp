import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener
} from "@angular/core";

import { DateAdapter } from "@angular/material/core";
import { NotificationsService } from "../shared/notifications-service.service";
import { PopupService } from "../shared/popup-service.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { SelectionModel, DataSource } from "@angular/cdk/collections";

import { map, startWith } from "rxjs/operators";
import { Observable, of, throwError, forkJoin } from "rxjs";

import { FirebaseService } from "../shared/firebase.service";

// import { Client } from "../customercards/client";
import { SupplyOfficer } from "../table-list/supplyofficer";
import { Task, CompletedTask } from "./task";

import { trigger, transition, animate, style } from "@angular/animations";

import * as Papa from "papaparse";
import * as moment from "moment";
import { Customer } from "app/components_settings/customers/customer";
import { isNumber } from "util";

export interface MouseEvent {
  rowId: number;
  colId: number;
  cellsType: string;
}

@Component({
  selector: "p-tasks",
  templateUrl: "./tasks-panel.component.html",
  styleUrls: ["./tasks-panel.component.css"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateY(-100%)" }),
        animate("200ms ease-in", style({ transform: "translateY(0%)" }))
      ]),
      transition(":leave", [
        animate("200ms ease-in", style({ transform: "translateY(-100%)" }))
      ])
    ])
  ]
})
export class TasksPanelComponent implements OnInit, AfterViewInit {
  company_new: string = "Select Company";
  date_new: string = "";
  clientData: Customer[];
  clientOptions_new: Observable<string[]>;
  selectedOfficer_new: SupplyOfficer;
  supplyOfficerList: SupplyOfficer[];
  submit_new = false;
  clients: string[] = [];
  filteredClients: string[] = [];
  debit_new: string;
  displayedColumns: string[] = [
    "Task ID",
    "Date",
    "Company",
    "Shop",
    "REP",
    "Debit",
    "Type",
    "Task Type",
    "Status",
    "Actions"
  ];
  displayedColumns_bulk: string[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator_completed: MatPaginator;


  activeTasksList: Task[] = new Array();
  completedTasksList: any[];



  dataSource: MatTableDataSource<Task>;
  dataSource_bulk: string[];
  dataSource_completed: MatTableDataSource<CompletedTask>;

 


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource_completed.filter = filterValue.trim().toLowerCase();
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource_completed.paginator = this.paginator_completed);

  }


  isEditTriggered: string = "NEW";

  // tableMouseDown:   MouseEvent;
  // tableMouseUp:     MouseEvent;
  // FIRST_EDITABLE_ROW: number = 0;
  // LAST_EDITABLE_ROW:  number = this.dataSource_bulk.length - 1; // = 9
  // FIRST_EDITABLE_COL: number = 1;                       // first column pos is not editable --> so start from index 1
  // LAST_EDITABLE_COL:  number = this.displayedColumns_bulk.length - 1; // = 3
  // newCellValue:       string = '';

  /**
   * NOTE: nbRows    of selectedCellsState must = nbRows of the tabl
   * nbColumns of selectedCellsState must = nbColumns of all selectable cells in the table
   */
  selectedCellsState: boolean[][] = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false],
    [false, false, false]
  ];

  company: string = "Select Company";

  Bulk_Display: boolean = false;


  tasksRef: firebase.database.Reference;

  constructor(
    private _adapter: DateAdapter<any>,
    public notificationsService: NotificationsService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService
  ) {
    this.newtaskForm = this.formBuilder.group({
      company_new: ["", Validators.required],
      date_new: ["", Validators.required],
      client_new: ["", Validators.required],
      selectedOfficer_new: ["", Validators.required],
      taskModel_new: ["", Validators.required],
      debit_new: ["", Validators.required],
      taskType_new: ["", Validators.required]
    });
    this.transfertaskForm = this.formBuilder.group({
      taskID_transfer: ["", Validators.required],
      REP_transfer: ["", Validators.required]
    });

    this.dataSource = new MatTableDataSource<Task>(this.activeTasksList);

    this.tasksRef = this.firebaseService.db.database.ref('TASKS');
    this.tasksRef.on('child_added', data => {
  
      // console.log("Listen, some data was added...")
      // console.log("Data is: ", data)
      // console.log("The details are, ", data.key, data.val())
  
  
      this.activeTasksList.push(data.val());
      // data.val()
  
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // addCommentElement(postElement, data.key, data.val().text, data.val().author);
    });
    
    this.tasksRef.on('child_changed', (data) =>{
      console.log("Listen, some data was changed...")
      console.log("Data is: ", data)
      console.log("The details are, ", data.key, data.val())
  //toDo: improve ythis
      let i = this.activeTasksList.findIndex(x => x.num === data.val().num);
      if (i !=-1)
        this.activeTasksList[i] = data.val();
      else
        this.activeTasksList.push(data.val());

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      // setCommentValues(postElement, data.key, data.val().text, data.val().author);
    });
    
    this.tasksRef.on('child_removed', (data) => {
      console.log("Listen, some data was deleted...")
      console.log("Data is: ", data)
  
      let i = this.activeTasksList.findIndex(data.val());
      if (i !=-1)
        this.activeTasksList.splice(i);
      
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;  

      // deleteComment(postElement, data.key);
    });
  


  }





  
  newtaskForm: FormGroup;
  transfertaskForm: FormGroup;

  isSubmitted = false;

  openDialog(
    header_new: string,
    body_new: string,
    footer_new: string,
    returnTo_new: string
  ): any {
    return this.dialog.open(PopupService, {
      width: "500px",
      data: { header: header_new, body: body_new, footer: footer_new }
    });
  }

  ngOnInit() {
    this.firebaseService.getClients().subscribe(clients => {
      this.clients = clients;
      this.filteredClients = clients;
    });

    this.newtaskForm.controls.client_new.valueChanges.subscribe(value => {
      this.filteredClients = this._filter(value);
    });

    this.firebaseService.getEmployees().subscribe((result: any) => {
      this.supplyOfficerList = result;
      console.log(`Got Employees: ${this.supplyOfficerList}`);
    });

    // this.firebaseService.getActiveTasks().subscribe(
    //   (result: any) => {
    //     this.activeTasksList = result;
    //     this.dataSource = new MatTableDataSource<Task>(this.activeTasksList);

    //     setTimeout(() => {
    //       this.dataSource.sort = this.sort;
    //       this.dataSource.paginator = this.paginator;
    //       console.log("Paginator time");
    //       console.log(this.sort);
    //     }, 500);

    //     // this.dataSource.sort = this.sort;
    //     // this.dataSource.paginator = this.paginator;

    //     console.log(`Got Tasks: ${this.activeTasksList}`);
    //   },
    //   err => {
    //     console.log("error caught");
    //     this.notificationsService.showNotification(3, "Error in retreiving tasks.", err);
    //   }
    // );

    let observer = this.firebaseService.getCompletedTasks().onSnapshot(doc => {
      console.log("Current data: ", doc.docs[0].data());

      this.completedTasksList = [];
      for (let i =0; i<doc.size; i++){
          this.completedTasksList.push(doc.docs[i].data());
      }

      this.dataSource_completed = new MatTableDataSource<CompletedTask>(this.completedTasksList);
  });
    
    // .subscribe(
    //   (result: any) => {
    //     this.dataSource_completed = new MatTableDataSource<CompletedTask>(result);

    //     setTimeout(() => {
    //       this.dataSource_completed.sort = this.sort;
    //       this.dataSource_completed.paginator = this.paginator_completed;
    //       console.log("Paginator time");
    //       console.log(this.sort);
    //     }, 500);

    //     // this.dataSource.sort = this.sort;
    //     // this.dataSource.paginator = this.paginator;

    //     // console.log(`Got Tasks: ${this.completedTasksList}`);
    //   },
    //   err => {
    //     console.log("error caught");
    //     this.notificationsService.showNotification(3, "Error in retreiving Completed tasks.", err);      }
    // );







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

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Task>(this.activeTasksList);
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource_completed.paginator = this.paginator_completed);

    this.dataSource.sort = this.sort;
    
    

  }

  get f() {
    return this.newtaskForm.controls;
  }


  submit_newCustomerDefault(){
    console.log("Creating new default customer with name", this.newtaskForm.controls['client_new'].value);

    // newUser.displayName=this.addUserFormGroup.controls['displayName'].value;
    // newUser.email= this.addUserFormGroup.controls['email'].value;
    // newUser.password= this.addUserFormGroup.controls['password'].value;
    // // newUser.displayName= this.addUserFormGroup.controls['displayName'].value;
    // newUser.REP= this.addUserFormGroup.controls['REP'].value;
    // newUser.
    this.firebaseService.createNewCustomer(this.newtaskForm.controls['client_new'].value);
    // stepper.reset();

  }


  changeEditStatus(task:any){
    this.newtaskForm.controls['company_new'].setValue(task.company);
    this.newtaskForm.controls['date_new'].setValue(moment(task.date, 'DD/MM/YYYY'));
    this.newtaskForm.controls['client_new'].setValue(task.shopName);
    this.newtaskForm.controls['selectedOfficer_new'].setValue(task.rep);
    this.newtaskForm.controls['taskModel_new'].setValue(task.taskModel);
    this.newtaskForm.controls['debit_new'].setValue(task.debit);
    this.newtaskForm.controls['taskType_new'].setValue(task.taskType);
    this.oldTask = task;
    this.isEditTriggered=task.status;
  }


  resetNewTask(){
    
    this.newtaskForm.reset();
    this.filteredClients = this._filter("");
    this.isEditTriggered="NEW";
  }



  deleteTask(taskKey: string, status: string, shopName: string, debit: string) {
    var DialogRef: any;
    if (status === "DONE"){
    DialogRef = this.openDialog(
      " you want to delete this task?",
      `<p style="color:red">DONE Tasks deleted from here will only be removed from the ACTIVE TASKS. The customer values will not be altered. </p>`,
      "This cannot be undone.",
      ""
    );

    DialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed, ${result}`);

      if (result) {
        // this.firebaseService.deleteTask(newTask, this.newtaskForm.controls['company_new'].value);
        // createdTask.then((result) => {
          let dataRef: any;
          this.firebaseService.deleteTask(taskKey);
          this.notificationsService.showNotification(
          3,
          "Task deleted.",
          "The action has been recorded.",
          ""
        );
        //  }).catch( (error) => {
        //  this.notificationsService.showNotification(4, "Error in deleting task:", '', '');
      }
      
      // );
    });
  }

  else if (status === "UNDONE" || status === "WAITING"){
    DialogRef = this.openDialog(
      " you want to delete this task?",
      `<p style="color:red">UNDONE or WAITING (unverified) Tasks deleted from here will also be removed from the database. The customer Debit and count values will be adjusted to their previous values. </p>`,
      "This cannot be undone.",
      ""
    );

    DialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed, ${result}`);

      if (result) {
        // this.firebaseService.deleteTask(newTask, this.newtaskForm.controls['company_new'].value);
        // createdTask.then((result) => {
          let dataRef: any;
          this.firebaseService.deleteTaskRestoreDebit(taskKey, shopName, debit);
          this.notificationsService.showNotification(
          3,
          "Task deleted.",
          "The action has been recorded.",
          ""
        );
        //  }).catch( (error) => {
        //  this.notificationsService.showNotification(4, "Error in deleting task:", '', '');
      }
      
      // );
    });
  }    
  
  }

  verifyTask(taskID:string, shopName:string){
    var DialogRef: any;
    DialogRef = this.openDialog(
      " you want to verify this task?",
      `<p style="color:red">The status of this task will be changed to DONE and will be saved in the record. The customer Debit values will be altered. </p>`,
      "This cannot be undone.",
      ""
    );

    DialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed, ${result}`);

      if (result) {
        // this.firebaseService.deleteTask(newTask, this.newtaskForm.controls['company_new'].value);
        // createdTask.then((result) => {
          let dataRef: any;
          this.firebaseService.updateTaskVerification(taskID, shopName);

        //  }).catch( (error) => {
        //  this.notificationsService.showNotification(4, "Error in deleting task:", '', '');
      }
      
      // );
    });
  }


  onSubmit_new(newTaskID: string = "") {
    this.submit_new = true;
    if (this.newtaskForm.invalid) {
      return;
    }
    var today = this.newtaskForm.controls["date_new"].value;
    var tomorrow = moment(today).add(1, "days");
    var datestring = JSON.stringify(tomorrow);
    console.log("The date is", datestring);
    var year = "";
    var month = "";
    var day = "";
    for (let i = 3; i < 5; i++) {
      year = year + datestring[i];
    }

    for (let i = 6; i < 8; i++) {
      month = month + datestring[i];
    }

    for (let i = 9; i < 11; i++) {
      day = day + datestring[i];
    }
    console.log("But the year is", year);
    console.log("And month is", month);
    console.log("And day is", day);
    let finalDate: string = day + "/" + month + "/20" + year;
    // let finalDate: string = day + "-" + month + "-" + year;
    console.log("The date is now", finalDate);
    // var newTask: Task=(this.newtaskForm.controls['type_new'].value, this.newtaskForm.controls['client'].value), finaldate=finalDate, date="123", selectedboi=this.newtaskForm.controls['selectedOfficer_new'].value, debitboi=this.newtaskForm.controls['debit_new'].value, statusboi='UNDONE', assignedboi=this.newtaskForm.controls['selectedOfficer_new'].value, tranboi="0", tasktypeboi=this.newtaskForm.controls['taskType_new'].value);
    let newTask = new Task(
      this.newtaskForm.controls["selectedOfficer_new"].value,
      "",
      finalDate,
      this.newtaskForm.controls["debit_new"].value,
      "",
      "",
      this.newtaskForm.controls["selectedOfficer_new"].value,
      this.newtaskForm.controls["client_new"].value,
      "UNDONE",
      this.newtaskForm.controls["taskModel_new"].value,
      this.newtaskForm.controls["taskType_new"].value,
      "1",
      this.newtaskForm.controls["company_new"].value
    );

    console.log(newTask);
    console.log(moment().unix());
    var DialogRef: any;
    DialogRef = this.openDialog(
      "? Preview your new task.",
      `COMPANY: ${newTask.company} <br>
      DATE: ${newTask.date} <br> 
      CLIENT: ${newTask.shopName} <br> 
      REP: ${newTask.rep} <br> 
      Task Model: ${newTask.taskModel} <br> 
      Debit: ${newTask.debit} <br> 
      Task Type: ${newTask.taskType} <br> 
      Extra Details:`,
      "",
      ""
    );

    DialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed, ${result}`);

      if (result) {
        this.firebaseService.createNewTask(newTask);
      }
      this.submit_new = false;
      this.newtaskForm.reset();
      // console.log(this.submit_new);
    });
  }



  oldTask: Task;
  onSubmit_UNDONE(newTaskID: string = "") {
    this.submit_new = true;
    if (this.newtaskForm.invalid) {
      return;
    }
    var today = this.newtaskForm.controls["date_new"].value;
    var tomorrow = moment(today).add(1, "days");
    var datestring = JSON.stringify(tomorrow);
    console.log("The date is", datestring);
    var year = "";
    var month = "";
    var day = "";
    for (let i = 3; i < 5; i++) {
      year = year + datestring[i];
    }

    for (let i = 6; i < 8; i++) {
      month = month + datestring[i];
    }

    for (let i = 9; i < 11; i++) {
      day = day + datestring[i];
    }
    console.log("But the year is", year);
    console.log("And month is", month);
    console.log("And day is", day);
    let finalDate: string = day + "/" + month + "/20" + year;
    // let finalDate: string = day + "-" + month + "-" + year;
    console.log("The date is now", finalDate);
    // var newTask: Task=(this.newtaskForm.controls['type_new'].value, this.newtaskForm.controls['client'].value), finaldate=finalDate, date="123", selectedboi=this.newtaskForm.controls['selectedOfficer_new'].value, debitboi=this.newtaskForm.controls['debit_new'].value, statusboi='UNDONE', assignedboi=this.newtaskForm.controls['selectedOfficer_new'].value, tranboi="0", tasktypeboi=this.newtaskForm.controls['taskType_new'].value);
    let thisTask = new Task(
      this.newtaskForm.controls["selectedOfficer_new"].value,
      this.oldTask.createdAt,
      finalDate,
      this.newtaskForm.controls["debit_new"].value,
      "",
      this.oldTask.num,
      this.newtaskForm.controls["selectedOfficer_new"].value,
      this.newtaskForm.controls["client_new"].value,
      "UNDONE",
      this.newtaskForm.controls["taskModel_new"].value,
      this.newtaskForm.controls["taskType_new"].value,
      this.oldTask.transference,
      this.newtaskForm.controls["company_new"].value
    );

    console.log(thisTask);
    console.log(moment().unix());
    var DialogRef: any;
    DialogRef = this.openDialog(
      "? Preview your updated task.",
      `COMPANY: ${thisTask.company} <br>
      DATE: ${thisTask.date} <br> 
      CLIENT: ${thisTask.shopName} <br> 
      REP: ${thisTask.rep} <br> 
      Task Model: ${thisTask.taskModel} <br> 
      Debit: ${thisTask.debit} <br> 
      Task Type: ${thisTask.taskType} <br> 
      Extra Details:`,
      "",
      ""
    );

    DialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed, ${result}`);

      console.log("Attempting to update the UNDONE task");

      if (result) {
        this.firebaseService.updateUNDONETask(thisTask, Number(this.oldTask.debit))
      }
      this.submit_new = false;
      this.newtaskForm.reset();
      // console.log(this.submit_new);
    });
  }

  onSubmit_bulk() {
    this.Bulk_Display = !this.Bulk_Display;
  }

  bulk_button_helper: string = "Upload Selected Tasks";



  bulkCompany:string;




processTasks() {
    console.log("The selected items are:", this.selection.selected);
    console.log("The Company is:", this.bulkCompany);
    
    // let bulkObserver: boolean;
    var endingLimit = this.selection.selected.length;

    var theSelectedTasks = [];
    var failedIndexes = [];

    var successcounter = 0;
    var observables: Observable<boolean>[] = [];

    var bulkDates: any[] = [];
    // date conversion
    for (let i = 0; i < this.selection.selected.length; i++) {
      bulkDates[i] = this.selection.selected[i]['Date'];
      if (bulkDates[i][2] === "-"){
        bulkDates[i][2] = "/";
        bulkDates[i][5] = "/";
        let year = bulkDates[i][6] + bulkDates[i][7];
        bulkDates[i][6] = "2";
        bulkDates[i][7] = "0";
        bulkDates[i] += year;
      }
    }

    for (let i = 0; i < this.selection.selected.length; i++) {
      let bulkNewTask: Task = new Task;
      bulkNewTask.assignedTo = this.selection.selected[i]['SUPPLIED BY'];
      bulkNewTask.createdAt = JSON.stringify(moment().unix());
      bulkNewTask.date = this.selection.selected[i]['Date'];

      let debit_converted: string = this.selection.selected[i]['Debit'];
      
      if (!isNumber(debit_converted))      debit_converted=debit_converted.replace(/,/g, '');
      

      bulkNewTask.debit = Number(debit_converted);

      console.log("The debit is:", debit_converted);


      bulkNewTask.lastUpdatedAt = "";      
      bulkNewTask.num = this.selection.selected[i]['Num'];
      bulkNewTask.rep = this.selection.selected[i]['SUPPLIED BY'];
      bulkNewTask.shopName = this.selection.selected[i]['Name'];
      bulkNewTask.status = "UNDONE";

      bulkNewTask.taskModel = this.selection.selected[i]['Type'];

      if (this.selection.selected[i]['Frequency'] == "R" || this.selection.selected[i]['Frequency'] == "r")
             bulkNewTask.taskType = "Regular";
      else if (this.selection.selected[i]['Frequency'] == "E" || this.selection.selected[i]['Frequency'] == "e")
             bulkNewTask.taskType = "Emergency";
      else if (this.selection.selected[i]['Frequency'] == "O" || this.selection.selected[i]['Frequency'] == "o")
             bulkNewTask.taskType = "Off-Schedule";
      else
            bulkNewTask.taskType = "";

      

      bulkNewTask.transference = "1";
      bulkNewTask.company = this.bulkCompany;

      // if (this.firebaseService.createBulkTasks(bulkNewTask))

      console.log("This task is... ", bulkNewTask );
      theSelectedTasks.push(bulkNewTask);

        observables.push(this.firebaseService.createBulkTasks(bulkNewTask));


      }

    forkJoin(observables)
      .subscribe(dataArray => {
          // All observables in `observables` array have resolved and `dataArray` is an array of result of each observable
          for (let i=0; i<endingLimit; i++){
            if (dataArray[i]===false){
              failedIndexes.push(theSelectedTasks[i]);
            }
            else{
              successcounter++;
            }
          }

          if (failedIndexes.length!=0){
            this.notificationsService.showNotification(
              4,
              `${failedIndexes.length} tasks could not be uploaded.`,
              `${failedIndexes}`,
              "customercards"
            );


          }
 

          if (failedIndexes.length != endingLimit){
            
            this.notificationsService.showNotification(
              2,
              `${successcounter} out of ${dataArray.length} tasks created successfully!`,
              "See the details in the bulk upload dialog.",
              "customercards"
            );

          }

        });



console.log("Reached the end of bulk upload.");



    // for (let i=0; i<this.selection.selected.length; i++){
    //     // var bulkNewTask: Task;
    //     bulkNewTask.assignedTo = this.selection.selected[i]['SUPPLIED BY'];
    //     bulkNewTask.createdAt = JSON.stringify(moment().unix());
    //     bulkNewTask.date = this.selection.selected[i]['Date'];

    //     let debit_converted: string = this.selection.selected[i]['Debit'].replace(/[\[\],]+/g, '');;
        

    //     bulkNewTask.debit = debit_converted;

    //     console.log("The debit is:", debit_converted);


    //     bulkNewTask.lastUpdatedAt = "";      
    //     bulkNewTask.num = this.selection.selected[i]['Num'];
    //     bulkNewTask.rep = this.selection.selected[i]['SUPPLIED BY'];
    //     bulkNewTask.shopName = this.selection.selected[i]['Name'];
    //     bulkNewTask.status = "UNDONE";

    //     bulkNewTask.taskModel = this.selection.selected[i]['Type'];

    //     if (this.selection.selected[i]['Frequency'] == "R" || this.selection.selected[i]['Frequency'] == "r")
    //            bulkNewTask.taskType = "Regular";
    //     else if (this.selection.selected[i]['Frequency'] == "E" || this.selection.selected[i]['Frequency'] == "e")
    //            bulkNewTask.taskType = "Emergency";
    //     else if (this.selection.selected[i]['Frequency'] == "O" || this.selection.selected[i]['Frequency'] == "o")
    //            bulkNewTask.taskType = "Off-Schedule";
    //     else
    //           bulkNewTask.taskType = "";

        

    //     bulkNewTask.transference = "1";
    //     bulkNewTask.company = this.bulkCompany;

    //     // if (this.firebaseService.createBulkTasks(bulkNewTask))

    //   console.log("This task is... ", bulkNewTask );

    //     // bulkNewTask.createdAt =
        
    //     // bulkNewTask.

    //     this.firebaseService.createBulkTasks(bulkNewTask).subscribe((result)=>{
    //       if (result==true){
    //         successcounter ++;
    //       }
    //       else{
    //         failedIndexes.push(bulkNewTask);
    //       }
    //       totalcounter++;
    //       if (totalcounter == endingLimit){
    //           let failedstring: string = "";
    //           if(successcounter!=totalcounter){
                
    //             this.notificationsService.showNotification(
    //               4,
    //               `The following tasks could not be uploaded.`,
    //               `${failedIndexes}`,
    //               "customercards"
    //             );
  
  
    //           }
    //           this.notificationsService.showNotification(
    //             2,
    //             `${successcounter} out of ${totalcounter} tasks created successfully!`,
    //             "See the details in the bulk upload dialog.",
    //             "customercards"
    //           );
    //       }
    //     });      

        
    // }

    const button = document.getElementById("bulk_button");
    button.classList.add("shakeit");
    this.bulk_button_helper =
      "There are some preventive errors, please resolve them and try again";

    console.log("The first task is: ", this.selection.selected[0]);
    let newTask: Task = this.selection.selected[0];
    console.log("newTask is: ", newTask);

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    // for (let i=0; i<10; i++)
    return this.clients.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  filetype_bulk: string = "";
  filesize_bulk: number = 0;
  filedate_bulk: Date;

  filekeys_bulk: any[];
  onFileSelect(input: HTMLInputElement) {
    const files = input.files;

    if (files && files.length) {
      console.log("Filename: " + files[0].name);
      console.log("Type: " + files[0].type);
      console.log("Size: " + files[0].size + " bytes");
      console.log("Last Modified: " + files[0].lastModified);

      var timestamp = files[0].lastModified;
      var dateString = new Date(timestamp);

      console.log("Last Modified CONVERTED: " + dateString);

      this.filetype_bulk = files[0].type;
      this.filesize_bulk = files[0].size;
      this.filedate_bulk = dateString;

      const fileToRead = files[0];
      Papa.parse(fileToRead, {
        delimiter: "", // auto-detect
        newline: "", // auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        transformHeader: undefined,
        dynamicTyping: true,
        preview: 0,
        encoding: "",
        worker: false,
        comments: false,
        step: undefined,
        error: function(err, file, inputElem, reason) {
          // executed if an error occurs while loading the file,
          // or if before callback aborted for some reason
        },
        complete: (results, file) => {
          console.log("Parsing complete:", results, file);
          console.log("This is just one task:", results.data[1]);
          console.log("This is just one date:", results.data[1].Date);
          console.log("This is just one debit:", results.data[1].Debit);
          console.log(
            "This is just one Debit with ECMAScript:",
            results.data[1][" Debit "]
          );
          console.log(
            "This is just one SUPPLIED BY with ECMAScript:",
            results.data[1]["SUPPLIED BY"]
          );
          console.log("These are the keys:", Object.keys(results.data[1]));
          console.log(
            "These are the keys STRINGIFY:",
            JSON.stringify(Object.keys(results.data[1]))
          );
          console.log(
            "These are the keys TRIM ATTEMPT STRINGIFY:",
            JSON.stringify(Object.keys(results.data[1])).replace(
              /"\s+|\s+"/g,
              '"'
            )
          );
          this.dataSource_bulk = results.data;
          // this.displayedColumns_bulk=
          this.displayedColumns_bulk = Object.keys(results.data[1]);
          console.log(this.displayedColumns_bulk);
          this.displayedColumns_bulk.push("select", "warning", "menu");
          console.log(this.displayedColumns_bulk);
          // results.data[1] = this.trimObj(results.data[1]);
          // console.log("This is just one debit AFTER TRIMMING:", results.data[1].Debit);
        },
        download: false,
        downloadRequestHeaders: undefined,
        skipEmptyLines: true,
        chunk: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined,
        delimitersToGuess: [",", "\t", "|", ";", Papa.RECORD_SEP, Papa.UNIT_SEP]
      });
      // const fileReader = new FileReader();
      // fileReader.onload = this.onFileLoad;

      // fileReader.readAsText(fileToRead, "UTF-8");
    }
  }
  // trimObj(obj: any): any {
  //   if (!Array.isArray(obj) && typeof obj !== 'object') return obj;
  //   return Object.keys(obj).reduce((acc, key) => {
  //     acc[key.trim()] = typeof obj[key] === 'string'? obj[key].trim() : this.trimObj(obj[key]);
  //     return acc;
  //   }, Array.isArray(obj)? []:{});
  // }

  selection = new SelectionModel<any>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource_bulk.length;
    return numSelected === numRows;
    // this.selection.
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource_bulk.forEach(row => {
          this.selection.select(row);
          // console.log("Checked value is:", row);
        });
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    // let returnTo: string;
    // returnTo= `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    // console.log("The checked value is:", returnTo);
    // return returnTo;
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
    } row ${row.position + 1}`;
  }

  // updateSelectedCellsValues(text: string) {

  //   if (text == null) { return; }

  //   if(this.tableMouseDown && this.tableMouseUp) {
  //     if(this.tableMouseDown.cellsType === this.tableMouseUp.cellsType) {

  //       const dataCopy:any = this.dataSource_bulk.slice(); // copy and mutate
  //       let startCol: number;
  //       let endCol:   number;
  //       let startRow: number;
  //       let endRow:   number;

  //       if(this.tableMouseDown.colId <= this.tableMouseUp.colId) {
  //         startCol = this.tableMouseDown.colId;
  //         endCol   = this.tableMouseUp.colId;
  //       } else {
  //         endCol   = this.tableMouseDown.colId;
  //         startCol = this.tableMouseUp.colId;
  //       }

  //       if(this.tableMouseDown.rowId <= this.tableMouseUp.rowId) {
  //         startRow = this.tableMouseDown.rowId;
  //         endRow   = this.tableMouseUp.rowId;
  //       } else {
  //         endRow   = this.tableMouseDown.rowId;
  //         startRow = this.tableMouseUp.rowId;
  //       }

  //       //--Edit cells from the same column
  //       if(startCol === endCol) {
  //         console.log('--Edit cells from the same column');
  //         for(let i = startRow; i <= endRow; i++) {
  //           dataCopy[i][this.displayedColumns[startCol]] = text;
  //         }
  //       } else {
  //         //--Edit cells starting and ending not on the same column
  //         console.log('--Edit cells starting and ending not on the same column');

  //         for(let i = startRow; i <= endRow; i++) {
  //           for(let j = startCol; j <= endCol; j++) {
  //             dataCopy[i][this.displayedColumns[j]] = text;
  //           }
  //         }
  //       }
  //       console.log('--update: ' + startRow + ', '+ startCol + ' to ' + endRow + ', '+ endCol);
  //       this.dataSource_bulk = dataCopy;

  //     } else {
  //       alert('Not the same type!');
  //       // this.openSnackBar('The selected cells don\'t have the same type.', 'OK');
  //     }
  //   }
  // }

  // /**
  //  * @param rowId
  //  * @param colId
  //  * @param cellsType
  //  */
  // onMouseDown(rowId: number, colId: number, cellsType: string) {

  //   this.tableMouseDown = {rowId: rowId, colId: colId, cellsType: cellsType};
  // }

  // /**
  //  * @param rowId
  //  * @param colId
  //  * @param cellsType
  //  */
  // onMouseUp(rowId: number, colId: number, cellsType: string) {

  //   this.tableMouseUp = {rowId: rowId, colId: colId, cellsType: cellsType};
  //   if(this.tableMouseDown) {
  //     this.newCellValue = '';
  //     this.updateSelectedCellsState(this.tableMouseDown.colId, this.tableMouseUp.colId, this.tableMouseDown.rowId, this.tableMouseUp.rowId);
  //   }
  // }

  // /**
  //  * Update selectedCols && selectedRows arrays
  //  * @param mouseDownColId
  //  * @param mouseUpColId
  //  * @param mouseDownRowId
  //  * @param mouseUpRowId
  //  */
  // private updateSelectedCellsState(mouseDownColId: number, mouseUpColId: number, mouseDownRowId: number, mouseUpRowId: number) {

  //   // init selected cells
  //   for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
  //     for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
  //       this.selectedCellsState[i][j] = false;
  //     }
  //   }
  //   // update selected cells
  //   let startCol: number;
  //   let endCol:   number;
  //   let startRow: number;
  //   let endRow:   number;
  //   if (mouseDownColId <= mouseUpColId) {
  //     startCol = mouseDownColId;
  //     endCol   = mouseUpColId;
  //   } else {
  //     endCol   = mouseDownColId;
  //     startCol = mouseUpColId;
  //   }

  //   if (mouseDownRowId <= mouseUpRowId) {
  //     startRow = mouseDownRowId;
  //     endRow   = mouseUpRowId;
  //   } else {
  //     endRow   = mouseDownRowId;
  //     startRow = mouseUpRowId;
  //   }
  //   for (let i = startRow; i <= endRow; i++) {
  //     for (let j = startCol; j <= endCol; j++) {
  //       this.selectedCellsState[i][j] = true;
  //     }
  //   }
  // }

  // /**
  //  * After the user enters a new value, all selected cells must be updated
  //  * document:keyup
  //  * @param event
  //  */
  // @HostListener('document:keyup', ['$event'])
  // onKeyUp(event: KeyboardEvent): void {

  //   // If no cell is selected then ignore keyUp event
  //   if(this.tableMouseDown && this.tableMouseUp) {

  //     let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
  //       'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
  //       'TabTab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
  //       'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

  //     if(event.key === 'Backspace') { // 'delete' key is pressed
  //       const end: number = this.newCellValue.length - 1;
  //       this.newCellValue = this.newCellValue.slice(0, end);

  //     } else if(this.indexOfInArray(event.key, specialKeys) === -1) {
  //       this.newCellValue += event.key;
  //     }
  //     this.updateSelectedCellsValues(this.newCellValue);
  //   }
  // }

  // indexOfInArray(item: string, array: string[]): number {
  //   let index: number = -1;
  //   for (let i = 0; i < array.length; i++) {
  //     if (array[i] === item) { index = i; }
  //   }
  //   return index;
  // }
}
