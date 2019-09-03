import { Component, OnInit } from '@angular/core';
import { Settings } from '../../layouts/settings-layout/settings'

const CSV_PARSE_SETTINGS: Settings[]=[
  {name: "skipEmpty", description: "Skip displaying/reading empty lines", uservalue: false, defaultvalue:true},
  {name: "fastMode", description: "Fast Mode", uservalue:false, defaultvalue:false}

]

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  lol=CSV_PARSE_SETTINGS;
  constructor() { }

  ngOnInit() {
  }

}
