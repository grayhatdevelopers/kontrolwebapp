import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'app/shared/firebase.service';
import { DateAdapter, MatDialog } from '@angular/material';
import { NotificationsService } from 'app/shared/notifications-service.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Customer } from 'app/components_settings/customers/customer';

@Component({
  selector: 'app-icons',
  templateUrl: './customercards.component.html',
  styleUrls: ['./customercards.component.css']
})
export class CustomerCardsComponent implements OnInit {

  clients: string[] = [];
  filteredClients: string[] = [];
  clientData: any;
  searchForm: FormGroup;


  constructor(
    private _adapter: DateAdapter<any>,
    public notificationsService: NotificationsService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public firebaseService: FirebaseService
    ) { 
      this.searchForm = this.formBuilder.group({
        client_search: [""],
      });
      
    }

  ngOnInit() {

    this.firebaseService.getClients().subscribe(clients => {
      this.clients = clients;
      this.filteredClients = clients;
    });

    this.firebaseService.getClientsData().subscribe(clients => {
      this.clientData = clients;
    });

    this.searchForm.controls.client_search.valueChanges.subscribe(value => {
      this.filteredClients = this._filter(value);
    });

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    // for (let i=0; i<10; i++)
    return this.clients.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }


}
