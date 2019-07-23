import { Component, OnInit } from '@angular/core';
import { SupplyOfficer } from './supplyofficer'
import { FirebaseService } from '../shared/firebase.service'
@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})

export class TableListComponent implements OnInit {
  panelOpenState = false;
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

}
