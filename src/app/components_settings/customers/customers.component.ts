import { Component, OnInit } from '@angular/core';
import { Settings } from 'app/layouts/settings-layout/settings';
const CUSTOMER_CREATION_SETTINGS: Settings[]=[
  {name: "noRuntime", description: "Disable custom Customer entry (disables Customer creation on runtime)", uservalue: false, defaultvalue:true},
  // {name: "fastMode", description: "Fast Mode", uservalue:false, defaultvalue:false}

]
@Component({
  selector: 'settings-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  creation_settings = CUSTOMER_CREATION_SETTINGS;
  constructor() { }

  ngOnInit() {
  }

}
