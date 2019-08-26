import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';
import { SettingsLayoutComponent } from './layouts/settings-layout/settings-layout.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, 
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    },
  
    // {
    //   path: '',
    //   loadChildren: './layouts/settings-layout/settings-layout.module#SettingsLayoutModule'
    // }
  
  ]
  },
  {
    path: '',
    component: PageLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/page-layout/page-layout.module#PageLayoutModule'
    }]
  },
  {
    path: 'settings',
    component: SettingsLayoutComponent,
    children: [{
      path: '',
      loadChildren: './layouts/settings-layout/settings-layout.module#SettingsLayoutModule'
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
