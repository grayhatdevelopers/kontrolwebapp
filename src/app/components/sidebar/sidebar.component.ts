import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/tasks', title: 'Tasks...',  icon:'add_circle', class: '' },
    { path: '/supplyofficers', title: 'Employee List',  icon:'content_paste', class: '' },
    { path: '/customercards', title: 'Customer Cards',  icon:'library_books', class: '' },
    { path: '/generate', title: 'Generate...',  icon:'bubble_chart', class: '' },
    { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/cheques', title: 'Manage Cheques',  icon:'receipt', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menuItems, event.previousIndex, event.currentIndex);
  }
}
